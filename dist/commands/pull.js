"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pullCommand = pullCommand;
const prompts_1 = require("@clack/prompts");
const picocolors_1 = __importDefault(require("picocolors"));
const store_1 = require("../store");
const git_1 = require("../git");
async function pullCommand() {
    (0, prompts_1.intro)(picocolors_1.default.cyan('aimat pull'));
    const s = (0, prompts_1.spinner)();
    const cloned = await (0, store_1.isRepoCloned)();
    if (!cloned) {
        s.start('Cloning AI-Material repo...');
        try {
            await (0, git_1.cloneRepo)();
            s.stop(picocolors_1.default.green('Cloned successfully'));
        }
        catch (e) {
            s.stop(picocolors_1.default.red('Clone failed: ' + e.message));
            process.exit(1);
        }
    }
    else {
        s.start('Pulling latest changes...');
        try {
            await (0, git_1.pullRepo)();
            s.stop(picocolors_1.default.green('Up to date'));
        }
        catch (e) {
            s.stop(picocolors_1.default.red('Pull failed: ' + e.message));
            process.exit(1);
        }
    }
    (0, prompts_1.outro)('Done');
}
