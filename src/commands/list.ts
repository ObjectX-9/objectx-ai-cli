import pc from 'picocolors'
import boxen from 'boxen'
import figlet from 'figlet'
import { listItems, getItemDescription, isRepoCloned, ItemType } from '../store'

const TYPES: ItemType[] = ['skills', 'workflows', 'rules', 'mcps']

const TYPE_ICON: Record<ItemType, string> = {
  skills:    '🛠 ',
  workflows: '📋',
  rules:     '📐',
  mcps:      '🔌',
}

const TYPE_LABEL: Record<ItemType, string> = {
  skills:    'Skills    技能脚本',
  workflows: 'Workflows 工作流',
  rules:     'Rules     编码规范',
  mcps:      'MCPs      MCP配置',
}

export async function listCommand(type?: string): Promise<void> {
  const cloned = await isRepoCloned()

  const stats = {} as Record<ItemType, number>
  for (const t of TYPES) {
    stats[t] = cloned ? (await listItems(t)).length : 0
  }

  // logo 直接打印，不放进 box 避免宽度计算问题
  const logo = figlet.textSync('ObjectX', { font: 'ANSI Shadow' })
  console.log('\n' + pc.cyan(logo))
  console.log(pc.dim('  AI 素材管理工具  ·  v0.1.0  ·  github.com/ObjectX-9/AI-Material\n'))

  // 快速开始 + 统计放进 boxen
  const commands = [
    `  ${pc.cyan('aimat pull')}         同步 GitHub 最新内容`,
    `  ${pc.cyan('aimat list')}         查看所有素材`,
    `  ${pc.cyan('aimat show')}         查看素材详情`,
    `  ${pc.cyan('aimat add')}          新增素材`,
    `  ${pc.cyan('aimat remove')}       删除素材`,
    `  ${pc.cyan('aimat push [msg]')}   推送改动到 GitHub`,
  ].join('\n')

  const statsStr = TYPES.map(t =>
    `  ${TYPE_ICON[t]} ${pc.dim(t.padEnd(12))} ${pc.cyan(pc.bold(String(stats[t])))} 个`
  ).join('\n')

  const infoBox = [
    pc.yellow(pc.bold('  快速开始')),
    commands,
    '',
    pc.yellow(pc.bold('  素材统计')) + (!cloned ? pc.dim('  （未同步，运行 aimat pull）') : ''),
    statsStr,
  ].join('\n')

  console.log(boxen(infoBox, {
    padding: { top: 1, bottom: 1, left: 1, right: 2 },
    borderStyle: 'round',
    borderColor: 'cyan',
  }))

  if (!cloned) {
    console.log(pc.yellow('  本地暂无数据，请先运行 ') + pc.cyan('aimat pull') + '\n')
    return
  }

  const types = type ? [type as ItemType] : TYPES

  for (const t of types) {
    const items = await listItems(t)
    console.log('\n' + pc.bold(`${TYPE_ICON[t]} ${TYPE_LABEL[t]}`))

    if (items.length === 0) {
      console.log(pc.dim('  暂无内容 — 运行 ') + pc.cyan('aimat add') + pc.dim(' 添加'))
      continue
    }

    for (const item of items) {
      const desc = await getItemDescription(t, item)
      const nameStr = pc.green(item.padEnd(24))
      const descStr = desc ? pc.dim(desc) : pc.dim('暂无描述')
      console.log(`  ${pc.green('▸')} ${nameStr} ${descStr}`)
    }
  }

  console.log()
}
