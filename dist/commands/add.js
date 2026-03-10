"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommand = addCommand;
const prompts_1 = require("@clack/prompts");
const picocolors_1 = __importDefault(require("picocolors"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path = __importStar(require("path"));
const store_1 = require("../store");
const git_1 = require("../git");
async function addCommand(type, name) {
    (0, prompts_1.intro)(picocolors_1.default.cyan('aimat add'));
    if (!(await (0, store_1.isRepoCloned)())) {
        console.log(picocolors_1.default.yellow('No local data. Run `aimat pull` first.'));
        process.exit(0);
    }
    let selectedType = type;
    if (!selectedType) {
        selectedType = (await (0, prompts_1.select)({
            message: 'Select type',
            options: [
                { value: 'skills', label: 'Skill (folder)' },
                { value: 'workflows', label: 'Workflow (markdown)' },
                { value: 'rules', label: 'Rule (folder)' },
                { value: 'mcps', label: 'MCP (json)' },
            ],
        }));
    }
    const selectedName = name ?? (await (0, prompts_1.text)({
        message: `Name of the ${selectedType.slice(0, -1)}`,
        validate: v => (!v ? 'Name is required' : undefined),
    }));
    const typeDir = (0, store_1.getTypeDir)(selectedType);
    await fs_extra_1.default.ensureDir(typeDir);
    if (selectedType === 'workflows') {
        const filePath = path.join(typeDir, `${selectedName}.md`);
        if (await fs_extra_1.default.pathExists(filePath)) {
            console.log(picocolors_1.default.yellow(`${selectedName} already exists.`));
            process.exit(0);
        }
        await fs_extra_1.default.writeFile(filePath, `# ${selectedName}\n\n`);
        console.log(picocolors_1.default.green(`Created ${filePath}`));
        console.log(picocolors_1.default.dim('Edit the file, then run `aimat push` to sync.'));
    }
    else if (selectedType === 'mcps') {
        const filePath = path.join(typeDir, `${selectedName}.json`);
        if (await fs_extra_1.default.pathExists(filePath)) {
            console.log(picocolors_1.default.yellow(`${selectedName} already exists.`));
            process.exit(0);
        }
        const template = {
            mcpServers: {
                [selectedName]: {
                    command: '',
                    args: [],
                    env: {}
                }
            }
        };
        await fs_extra_1.default.writeFile(filePath, JSON.stringify(template, null, 2));
        console.log(picocolors_1.default.green(`Created ${filePath}`));
        console.log(picocolors_1.default.dim('Edit the JSON file, then run `aimat push` to sync.'));
    }
    else {
        const folderPath = path.join(typeDir, selectedName);
        if (await fs_extra_1.default.pathExists(folderPath)) {
            console.log(picocolors_1.default.yellow(`${selectedName} already exists.`));
            process.exit(0);
        }
        await fs_extra_1.default.ensureDir(folderPath);
        await fs_extra_1.default.writeFile(path.join(folderPath, 'README.md'), `# ${selectedName}\n\n`);
        console.log(picocolors_1.default.green(`Created ${folderPath}/`));
        console.log(picocolors_1.default.dim('Add your files, then run `aimat push` to sync.'));
    }
    const s = (0, prompts_1.spinner)();
    s.start('Pushing to GitHub...');
    try {
        await (0, git_1.pushChanges)(`add ${selectedType.slice(0, -1)}: ${selectedName}`);
        s.stop(picocolors_1.default.green('Pushed'));
    }
    catch (e) {
        s.stop(picocolors_1.default.red('Push failed: ' + e.message));
    }
    (0, prompts_1.outro)('Done');
}
