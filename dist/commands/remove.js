"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCommand = removeCommand;
const prompts_1 = require("@clack/prompts");
const picocolors_1 = __importDefault(require("picocolors"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const store_1 = require("../store");
const git_1 = require("../git");
async function removeCommand(type, name) {
    (0, prompts_1.intro)(picocolors_1.default.cyan('aimat remove'));
    if (!(await (0, store_1.isRepoCloned)())) {
        console.log(picocolors_1.default.yellow('No local data. Run `aimat pull` first.'));
        process.exit(0);
    }
    let selectedType = type;
    if (!selectedType) {
        selectedType = (await (0, prompts_1.select)({
            message: 'Select type',
            options: [
                { value: 'skills', label: 'Skills' },
                { value: 'workflows', label: 'Workflows' },
                { value: 'rules', label: 'Rules' },
                { value: 'mcps', label: 'MCPs' },
            ],
        }));
    }
    let selectedName = name;
    if (!selectedName) {
        const items = await (0, store_1.listItems)(selectedType);
        if (items.length === 0) {
            console.log(picocolors_1.default.yellow(`No ${selectedType} found.`));
            process.exit(0);
        }
        selectedName = (await (0, prompts_1.select)({
            message: `Select ${selectedType.slice(0, -1)} to remove`,
            options: items.map(i => ({ value: i, label: i })),
        }));
    }
    const confirmed = await (0, prompts_1.confirm)({
        message: `Remove ${selectedName}? This will also delete it from GitHub.`,
    });
    if (!confirmed) {
        (0, prompts_1.outro)('Cancelled');
        return;
    }
    const itemPath = await (0, store_1.getItemPath)(selectedType, selectedName);
    await fs_extra_1.default.remove(itemPath);
    console.log(picocolors_1.default.green(`Removed ${selectedName}`));
    const s = (0, prompts_1.spinner)();
    s.start('Pushing to GitHub...');
    try {
        await (0, git_1.pushChanges)(`remove ${selectedType.slice(0, -1)}: ${selectedName}`);
        s.stop(picocolors_1.default.green('Pushed'));
    }
    catch (e) {
        s.stop(picocolors_1.default.red('Push failed: ' + e.message));
    }
    (0, prompts_1.outro)('Done');
}
