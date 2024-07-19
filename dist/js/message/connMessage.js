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
class connMessage {
    constructor() {
        this.sock = this;
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(method => typeof this[method] === 'function' && method !== 'constructor');
        methods.forEach(method => {
            this[method] = this[method].bind(this);
        });
    }
    send(m, text) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sock.sendMessage(m.key.remoteJid, { text: text });
        });
    }
}
//# sourceMappingURL=connMessage.js.map