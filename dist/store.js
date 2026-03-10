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
exports.REPO_DIR = exports.LOCAL_DIR = exports.REPO_URL = void 0;
exports.getTypeDir = getTypeDir;
exports.isRepoCloned = isRepoCloned;
exports.listItems = listItems;
exports.getItemDescription = getItemDescription;
exports.getItemPath = getItemPath;
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const fs_extra_1 = __importDefault(require("fs-extra"));
exports.REPO_URL = 'git@github.com:ObjectX-9/AI-Material.git';
exports.LOCAL_DIR = path.join(os.homedir(), '.aimat');
exports.REPO_DIR = path.join(exports.LOCAL_DIR, 'AI-Material');
function getTypeDir(type) {
    return path.join(exports.REPO_DIR, type);
}
async function isRepoCloned() {
    return fs_extra_1.default.pathExists(path.join(exports.REPO_DIR, '.git'));
}
async function listItems(type) {
    const dir = getTypeDir(type);
    if (!(await fs_extra_1.default.pathExists(dir)))
        return [];
    const entries = await fs_extra_1.default.readdir(dir, { withFileTypes: true });
    if (type === 'workflows') {
        return entries
            .filter(e => e.isFile() && e.name.endsWith('.md'))
            .map(e => e.name.replace('.md', ''));
    }
    if (type === 'mcps') {
        return entries
            .filter(e => e.isFile() && e.name.endsWith('.json'))
            .map(e => e.name.replace('.json', ''));
    }
    // skills and rules are folders
    return entries.filter(e => e.isDirectory()).map(e => e.name);
}
async function getItemDescription(type, name) {
    try {
        if (type === 'workflows') {
            const filePath = path.join(getTypeDir(type), `${name}.md`);
            const content = await fs_extra_1.default.readFile(filePath, 'utf-8');
            // 取第一个非标题、非空的行
            const line = content.split('\n').find(l => l.trim() && !l.startsWith('#'));
            return line?.trim() ?? '';
        }
        if (type === 'mcps') {
            const filePath = path.join(getTypeDir(type), `${name}.json`);
            const json = await fs_extra_1.default.readJson(filePath);
            return json.description ?? Object.keys(json.mcpServers ?? {}).join(', ');
        }
        // skills / rules: 读 README.md 第一个非标题行
        const readme = path.join(getTypeDir(type), name, 'README.md');
        if (await fs_extra_1.default.pathExists(readme)) {
            const content = await fs_extra_1.default.readFile(readme, 'utf-8');
            const line = content.split('\n').find(l => l.trim() && !l.startsWith('#'));
            return line?.trim() ?? '';
        }
    }
    catch { }
    return '';
}
async function getItemPath(type, name) {
    if (type === 'workflows') {
        return path.join(getTypeDir(type), `${name}.md`);
    }
    if (type === 'mcps') {
        return path.join(getTypeDir(type), `${name}.json`);
    }
    return path.join(getTypeDir(type), name);
}
