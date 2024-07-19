/**
 * Represents a command structure.
 * @interface
 */
interface Command {
    usage: string | string[];
    aliases?: string[];
    __filename?: string;
}
export declare const loadCommands: (commandDir: string) => Promise<void>;
export declare const getCommand: (name: string) => Command | undefined;
export declare const getAllCommands: () => Command[];
export {};
//# sourceMappingURL=loadCommand.d.ts.map