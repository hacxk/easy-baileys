import fs from 'fs/promises';
import path from 'path';
import chokidar from 'chokidar';
import debounce from 'lodash.debounce';

/**
 * Represents a command structure.
 * @interface
 */
interface Command {
    usage: string | string[];
    aliases?: string[];
    __filename?: string;
}

/**
 * A map of command usage to Command objects.
 * @interface
 */
interface CommandMap {
    [key: string]: Command;
}

/**
 * A map of command aliases to their corresponding usage.
 * @interface
 */
interface CommandAliasMap {
    [key: string]: string;
}

/**
 * Class representing a command loader that dynamically loads and watches commands from a directory.
 * @class
 */
class CommandLoader {
    private commands: CommandMap = {};
    private aliases: CommandAliasMap = {};
    private watchers: Set<chokidar.FSWatcher> = new Set();
    private debounceTime: number = 1000;

    /**
     * Create a CommandLoader instance.
     * @constructor
     */
    constructor() { }

    /**
     * Loads all commands from the specified directory and sets up command watching.
     * @param {string} commandDir - The directory path where commands are located.
     * @returns {Promise<void>} A promise that resolves when loading and watching are complete.
     */
    async loadCommands(commandDir: string): Promise<void> {
        await this.loadAllCommands(commandDir);
        this.watchCommands(commandDir);
        process.on('SIGINT', () => this.cleanup());
    }

    /**
     * Recursively loads all commands from the specified directory.
     * @param {string} dir - The directory path to load commands from.
     * @returns {Promise<void>} A promise that resolves when all commands have been loaded.
     */
    private async loadAllCommands(dir: string): Promise<void> {
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
     * @returns {Promise<void>} A promise that resolves when the command has been loaded.
     */
    private async loadCommand(filePath: string): Promise<void> {
        try {
            const resolvedPath = path.resolve(filePath);
            delete require.cache[require.resolve(resolvedPath)];
            const command: Command = require(resolvedPath);
            if (command.usage) {
                const usages: string[] = Array.isArray(command.usage) ? command.usage : [command.usage];
                usages.forEach(usage => {
                    this.commands[usage.toLowerCase()] = { ...command, usage };

                    if (command.aliases) {
                        command.aliases.forEach(alias => {
                            this.aliases[alias.toLowerCase()] = usage;
                        });
                    }
                });
            }
        } catch (error) {
            console.error(`Failed to load command from ${filePath}:`, error);
        }
    }

    /**
     * Sets up file watching on the command directory for adding, changing, and removing commands dynamically.
     * @param {string} commandDir - The directory path to watch for command changes.
     */
    private watchCommands(commandDir: string): void {
        const watcher = chokidar.watch(commandDir, {
            ignored: /(^|[\/\\])\../,
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
    private handleFileChange = debounce(async (event: string, filePath: string) => {
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
    private removeCommand(filePath: string): void {
        const commandsToRemove = Object.entries(this.commands)
            .filter(([_, cmd]) => cmd.__filename === filePath);

        commandsToRemove.forEach(([usage, command]) => {
            delete this.commands[usage];

            if (command.aliases) {
                command.aliases.forEach(alias => {
                    if (this.aliases[alias.toLowerCase()] === usage) {
                        delete this.aliases[alias.toLowerCase()];
                    }
                });
            }
        });
    }

    /**
     * Cleans up by closing all watchers and exiting the process.
     */
    private cleanup(): void {
        this.watchers.forEach(watcher => watcher.close());
        process.exit();
    }

    /**
     * Retrieves a command by its name or alias.
     * @param {string} name - The name or alias of the command to retrieve.
     * @returns {Command | undefined} The command object if found, undefined otherwise.
     * @throws {Error} Throws an error if no command name is provided.
     */
    getCommand(name: string): Command | undefined {
        if (!name) {
            throw new Error('Please Provide a Command name to Get!');
        }
        const lowercaseName = name.toLowerCase();
        return this.commands[lowercaseName] || this.commands[this.aliases[lowercaseName]];
    }

    /**
     * Retrieves all commands.
     * @returns {Command[]} An array of all command objects.
     */
    getAllCommands(): Command[] {
        return Object.values(this.commands);
    }
}

// Exporting functions to interact with CommandLoader instance.
const commandLoader = new CommandLoader();

export const loadCommands = commandLoader.loadCommands.bind(commandLoader);
export const getCommand = commandLoader.getCommand.bind(commandLoader);
export const getAllCommands = commandLoader.getAllCommands.bind(commandLoader);
