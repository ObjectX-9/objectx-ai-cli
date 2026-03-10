# objectx-ai-cli

> AI 素材管理工具，用于管理你的 skills、workflows、rules 和 MCP 配置，内容存储在 GitHub，本地通过 CLI 增删查同步。

## 安装

```bash
npm install -g objectx-ai-cli
```

或者直接用 npx：

```bash
npx objectx-ai-cli <command>
```

## 快速开始

```bash
# 第一步：同步 GitHub 内容到本地
aimat pull

# 查看所有素材
aimat list

# 查看某类素材
aimat list skills
```

## 命令

| 命令 | 说明 |
|------|------|
| `aimat pull` | 从 GitHub 克隆或拉取最新内容 |
| `aimat list [type]` | 列出所有素材，可按类型过滤 |
| `aimat show [type] [name]` | 查看素材详情，支持交互式选择 |
| `aimat add [type] [name]` | 新增素材，支持交互式引导 |
| `aimat remove [type] [name]` | 删除素材并同步到 GitHub |
| `aimat push [message]` | 推送本地改动到 GitHub |

## 素材类型

- **skills** — 技能脚本，文件夹结构，可包含脚本、文档等任意文件
- **workflows** — 工作流，Markdown 格式的步骤指南
- **rules** — 编码规范，文件夹结构，可包含 `.cursorrules`、`.kiro` 等配置
- **mcps** — MCP 服务配置，JSON 格式，符合 `mcpServers` 标准结构

## 数据存储

内容存储在 GitHub 仓库 [ObjectX-9/AI-Material](https://github.com/ObjectX-9/AI-Material)，本地缓存在 `~/.aimat/` 目录。

```
AI-Material/
├── skills/
│   └── my-skill/
│       ├── README.md
│       └── script.sh
├── workflows/
│   └── my-workflow.md
├── rules/
│   └── my-rule/
│       ├── README.md
│       └── .cursorrules
└── mcps/
    └── my-mcp.json
```

## 开发

```bash
git clone <this-repo>
cd objectx-ai-cli
pnpm install
pnpm build

# 本地链接
pnpm link --global
```
