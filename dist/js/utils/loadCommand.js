"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCommands = exports.getCommand = exports.loadCommands = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const chokidar_1 = __importDefault(require("chokidar"));
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
/**
 * Class representing a command loader that dynamically loads and watches commands from a directory.
 * @class
 */
class CommandLoader {
    /**
     * Create a CommandLoader instance.
     * @constructor
     */
    constructor() {
        this.commands = {};
        this.aliases = {};
        this.watchers = new Set();
        this.debounceTime = 1000;
        /**
         * Handles file changes (add, change, unlink) and updates commands accordingly.
         * @param {string} event - The type of file event ('add', 'change', 'unlink').
         * @param {string} filePath - The path of the file that triggered the event.
         */
        this.handleFileChange = (0, lodash_debounce_1.default)((event, filePath) => __awaiter(this, void 0, void 0, function* () {
            if (filePath.endsWith('.js')) {
                if (event === 'unlink') {
                    this.removeCommand(filePath);
                }
                else {
                    yield this.loadCommand(filePath);
                }
            }
        }), this.debounceTime);
    }
    /**
     * Loads all commands from the specified directory and sets up command watching.
     * @param {string} commandDir - The directory path where commands are located.
     * @returns {Promise<void>} A promise that resolves when loading and watching are complete.
     */
    loadCommands(commandDir) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadAllCommands(commandDir);
            this.watchCommands(commandDir);
            process.on('SIGINT', () => this.cleanup());
        });
    }
    /**
     * Recursively loads all commands from the specified directory.
     * @param {string} dir - The directory path to load commands from.
     * @returns {Promise<void>} A promise that resolves when all commands have been loaded.
     */
    loadAllCommands(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield promises_1.default.readdir(dir);
            for (const file of files) {
                const filePath = path_1.default.join(dir, file);
                const stat = yield promises_1.default.stat(filePath);
                if (stat.isDirectory()) {
                    yield this.loadAllCommands(filePath);
                }
                else if (file.endsWith('.js')) {
                    yield this.loadCommand(filePath);
                }
            }
        });
    }
    /**
     * Loads a command from a file path and adds it to the commands map.
     * @param {string} filePath - The path of the command file to load.
     * @returns {Promise<void>} A promise that resolves when the command has been loaded.
     */
    loadCommand(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resolvedPath = path_1.default.resolve(filePath);
                delete require.cache[require.resolve(resolvedPath)];
                const command = require(resolvedPath);
                if (command.usage) {
                    const usages = Array.isArray(command.usage) ? command.usage : [command.usage];
                    usages.forEach(usage => {
                        this.commands[usage.toLowerCase()] = Object.assign(Object.assign({}, command), { usage });
                        if (command.aliases) {
                            command.aliases.forEach(alias => {
                                this.aliases[alias.toLowerCase()] = usage;
                            });
                        }
                    });
                }
            }
            catch (error) {
                console.error(`Failed to load command from ${filePath}:`, error);
            }
        });
    }
    /**
     * Sets up file watching on the command directory for adding, changing, and removing commands dynamically.
     * @param {string} commandDir - The directory path to watch for command changes.
     */
    watchCommands(commandDir) {
        const watcher = chokidar_1.default.watch(commandDir, {
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
     * Removes a command and its aliases from the commands map and aliases map.
     * @param {string} filePath - The path of the command file to remove.
     */
    removeCommand(filePath) {
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
    cleanup() {
        this.watchers.forEach(watcher => watcher.close());
        process.exit();
    }
    /**
     * Retrieves a command by its name or alias.
     * @param {string} name - The name or alias of the command to retrieve.
     * @returns {Command | undefined} The command object if found, undefined otherwise.
     * @throws {Error} Throws an error if no command name is provided.
     */
    getCommand(name) {
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
    getAllCommands() {
        return Object.values(this.commands);
    }
}
// Exporting functions to interact with CommandLoader instance.
const commandLoader = new CommandLoader();
exports.loadCommands = commandLoader.loadCommands.bind(commandLoader);
exports.getCommand = commandLoader.getCommand.bind(commandLoader);
exports.getAllCommands = commandLoader.getAllCommands.bind(commandLoader);
//# sourceMappingURL=loadCommand.js.map