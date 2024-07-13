const fs = require('fs').promises;
const path = require('path');
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');


/**
 * Class representing a command loader that dynamically loads and watches commands from a directory.
 */
class CommandLoader {
  /**
   * Create a CommandLoader instance.
   */
  constructor() {
    this.commands = new Map();
    this.aliases = new Map();
    this.watchers = new Set();
    this.debounceTime = 1000;
  }

  /**
   * Loads all commands from the specified directory and sets up command watching.
   * @param {string} commandDir - The directory path where commands are located.
   */
  async loadCommands(commandDir) {
    await this.loadAllCommands(commandDir);
    this.watchCommands(commandDir);
    process.on('SIGINT', () => this.cleanup());
  }

  /**
   * Recursively loads all commands from the specified directory.
   * @param {string} dir - The directory path to load commands from.
   */
  async loadAllCommands(dir) {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        await this.loadAllCommands(filePath);
      } else if (file.endsWith('.js')) {
        await this.loadCommand(filePath);
      }
    }
  }

  /**
   * Loads a command from a file path and adds it to the commands map.
   * @param {string} filePath - The path of the command file to load.
   */
  async loadCommand(filePath) {
    try {
      const resolvedPath = path.resolve(filePath);
      delete require.cache[require.resolve(resolvedPath)];
      const command = require(resolvedPath);
      if (command.usage) {
        const usages = Array.isArray(command.usage) ? command.usage : [command.usage];
        usages.forEach(usage => {
          this.commands.set(usage.toLowerCase(), command);
        });
        if (command.aliases) {
          command.aliases.forEach(alias => {
            this.aliases.set(alias.toLowerCase(), command.usage);
          });
        }
      }
    } catch (error) {
      // Handle error silently or with a logging library if needed
    }
  }

  /**
   * Sets up file watching on the command directory for adding, changing, and removing commands dynamically.
   * @param {string} commandDir - The directory path to watch for command changes.
   */
  watchCommands(commandDir) {
    const watcher = chokidar.watch(commandDir, {
      ignored: /(^|[\/\\])\../, // Ignore dot files
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
      }
    });
    watcher
      .on('add', path => this.handleFileChange('add', path))
      .on('change', path => this.handleFileChange('change', path))
      .on('unlink', path => this.handleFileChange('unlink', path));
    this.watchers.add(watcher);
  }

  /**
   * Handles file changes (add, change, unlink) and updates commands accordingly.
   * @param {string} event - The type of file event ('add', 'change', 'unlink').
   * @param {string} filePath - The path of the file that triggered the event.
   */
  handleFileChange = debounce(async (event, filePath) => {
    if (filePath.endsWith('.js')) {
      if (event === 'unlink') {
        this.removeCommand(filePath);
      } else {
        await this.loadCommand(filePath);
      }
    }
  }, this.debounceTime);

  /**
   * Removes a command and its aliases from the commands map and aliases map.
   * @param {string} filePath - The path of the command file to remove.
   */
  removeCommand(filePath) {
    const commandsToRemove = Array.from(this.commands.entries())
      .filter(([_, cmd]) => cmd.__filename === filePath);
    
    commandsToRemove.forEach(([usage, command]) => {
      this.commands.delete(usage);
      
      if (command.aliases) {
        command.aliases.forEach(alias => {
          if (this.aliases.get(alias.toLowerCase()) === usage) {
            this.aliases.delete(alias.toLowerCase());
          }
        });
      }
    });
  }

  /**
   * Cleans up by closing all watchers and exiting the process.
   */
  cleanup() {
    this.watchers.forEach(watcher => watcher.close());
    process.exit();
  }

  /**
   * Retrieves a command by its name or alias.
   * @param {string} name - The name or alias of the command to retrieve.
   * @returns {object|undefined} The command object if found, undefined otherwise.
   * @throws {Error} Throws an error if no command name is provided.
   */
  getCommand(name) {
    if (!name) {
      throw new Error('Please Provide a Command name to Get!');
    }
    const lowercaseName = name.toLowerCase();
    return this.commands.get(lowercaseName) || this.commands.get(this.aliases.get(lowercaseName));
  }
}

const loader = new CommandLoader();

module.exports = {
  /**
   * Loads commands from the specified directory and sets up watching.
   * @param {string} dir - The directory path where commands are located.
   */
  loadCommands: (dir) => loader.loadCommands(dir),

  /**
   * Retrieves a command by its name or alias.
   * @param {string} name - The name or alias of the command to retrieve.
   * @returns {object|undefined} The command object if found, undefined otherwise.
   */
  getCommand: (name) => loader.getCommand(name),

  /**
   * Retrieves all loaded commands.
   * @returns {Array<object>} An array containing all loaded command objects.
   */
  getAllCommands: () => Array.from(loader.commands.values())
};
