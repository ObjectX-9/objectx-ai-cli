"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showCommand = showCommand;
const prompts_1 = require("@clack/prompts");
const picocolors_1 = __importDefault(require("picocolors"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const store_1 = require("../store");
async function showCommand(type, name) {
    (0, prompts_1.intro)(picocolors_1.default.cyan('aimat show'));
    if (!(await (0, store_1.isRepoCloned)())) {
        console.log(picocolors_1.default.yellow('No local data. Run `aimat pull` first.'));
        process.exit(0);
    }
    // interactive select if not provided
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
            message: `Select ${selectedType.slice(0, -1)}`,
            options: items.map(i => ({ value: i, label: i })),
        }));
    }
    const itemPath = await (0, store_1.getItemPath)(selectedType, selectedName);
    if (!(await fs_extra_1.default.pathExists(itemPath))) {
        console.log(picocolors_1.default.red(`Not found: ${selectedName}`));
        process.exit(1);
    }
    const stat = await fs_extra_1.default.stat(itemPath);
    if (stat.isFile()) {
        const content = await fs_extra_1.default.readFile(itemPath, 'utf-8');
        console.log('\n' + content);
    }
    else {
        // folder: list files
        const files = await fs_extra_1.default.readdir(itemPath);
        console.log(picocolors_1.default.bold(`\nFiles in ${selectedName}:`));
        files.forEach(f => console.log(`  ${picocolors_1.default.green('•')} ${f}`));
    }
    (0, prompts_1.outro)('');
}
