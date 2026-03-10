"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushCommand = pushCommand;
const prompts_1 = require("@clack/prompts");
const picocolors_1 = __importDefault(require("picocolors"));
const store_1 = require("../store");
const git_1 = require("../git");
async function pushCommand(message) {
    (0, prompts_1.intro)(picocolors_1.default.cyan('aimat push'));
    if (!(await (0, store_1.isRepoCloned)())) {
        console.log(picocolors_1.default.yellow('No local data. Run `aimat pull` first.'));
        process.exit(0);
    }
    const msg = message ?? (await (0, prompts_1.text)({
        message: 'Commit message',
        defaultValue: 'update materials',
    }));
    const s = (0, prompts_1.spinner)();
    s.start('Pushing to GitHub...');
    try {
        await (0, git_1.pushChanges)(msg);
        s.stop(picocolors_1.default.green('Pushed successfully'));
    }
    catch (e) {
        s.stop(picocolors_1.default.red('Push failed: ' + e.message));
        process.exit(1);
    }
    (0, prompts_1.outro)('Done');
}
