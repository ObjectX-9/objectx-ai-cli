"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommand = listCommand;
const picocolors_1 = __importDefault(require("picocolors"));
const boxen_1 = __importDefault(require("boxen"));
const figlet_1 = __importDefault(require("figlet"));
const store_1 = require("../store");
const TYPES = ['skills', 'workflows', 'rules', 'mcps'];
const TYPE_ICON = {
    skills: '🛠 ',
    workflows: '📋',
    rules: '📐',
    mcps: '🔌',
};
const TYPE_LABEL = {
    skills: 'Skills    技能脚本',
    workflows: 'Workflows 工作流',
    rules: 'Rules     编码规范',
    mcps: 'MCPs      MCP配置',
};
async function listCommand(type) {
    const cloned = await (0, store_1.isRepoCloned)();
    const stats = {};
    for (const t of TYPES) {
        stats[t] = cloned ? (await (0, store_1.listItems)(t)).length : 0;
    }
    // logo 直接打印，不放进 box 避免宽度计算问题
    const logo = figlet_1.default.textSync('ObjectX', { font: 'ANSI Shadow' });
    console.log('\n' + picocolors_1.default.cyan(logo));
    console.log(picocolors_1.default.dim('  AI 素材管理工具  ·  v0.1.0  ·  github.com/ObjectX-9/AI-Material\n'));
    // 快速开始 + 统计放进 boxen
    const commands = [
        `  ${picocolors_1.default.cyan('aimat pull')}         同步 GitHub 最新内容`,
        `  ${picocolors_1.default.cyan('aimat list')}         查看所有素材`,
        `  ${picocolors_1.default.cyan('aimat show')}         查看素材详情`,
        `  ${picocolors_1.default.cyan('aimat add')}          新增素材`,
        `  ${picocolors_1.default.cyan('aimat remove')}       删除素材`,
        `  ${picocolors_1.default.cyan('aimat push [msg]')}   推送改动到 GitHub`,
    ].join('\n');
    const statsStr = TYPES.map(t => `  ${TYPE_ICON[t]} ${picocolors_1.default.dim(t.padEnd(12))} ${picocolors_1.default.cyan(picocolors_1.default.bold(String(stats[t])))} 个`).join('\n');
    const infoBox = [
        picocolors_1.default.yellow(picocolors_1.default.bold('  快速开始')),
        commands,
        '',
        picocolors_1.default.yellow(picocolors_1.default.bold('  素材统计')) + (!cloned ? picocolors_1.default.dim('  （未同步，运行 aimat pull）') : ''),
        statsStr,
    ].join('\n');
    console.log((0, boxen_1.default)(infoBox, {
        padding: { top: 1, bottom: 1, left: 1, right: 2 },
        borderStyle: 'round',
        borderColor: 'cyan',
    }));
    if (!cloned) {
        console.log(picocolors_1.default.yellow('  本地暂无数据，请先运行 ') + picocolors_1.default.cyan('aimat pull') + '\n');
        return;
    }
    const types = type ? [type] : TYPES;
    for (const t of types) {
        const items = await (0, store_1.listItems)(t);
        console.log('\n' + picocolors_1.default.bold(`${TYPE_ICON[t]} ${TYPE_LABEL[t]}`));
        if (items.length === 0) {
            console.log(picocolors_1.default.dim('  暂无内容 — 运行 ') + picocolors_1.default.cyan('aimat add') + picocolors_1.default.dim(' 添加'));
            continue;
        }
        for (const item of items) {
            const desc = await (0, store_1.getItemDescription)(t, item);
            const nameStr = picocolors_1.default.green(item.padEnd(24));
            const descStr = desc ? picocolors_1.default.dim(desc) : picocolors_1.default.dim('暂无描述');
            console.log(`  ${picocolors_1.default.green('▸')} ${nameStr} ${descStr}`);
        }
    }
    console.log();
}
