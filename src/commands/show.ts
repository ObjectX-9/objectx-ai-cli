import { intro, outro, select } from '@clack/prompts'
import pc from 'picocolors'
import fs from 'fs-extra'
import { listItems, getItemPath, isRepoCloned, ItemType } from '../store'

export async function showCommand(type?: string, name?: string): Promise<void> {
  intro(pc.cyan('aimat show'))

  if (!(await isRepoCloned())) {
    console.log(pc.yellow('No local data. Run `aimat pull` first.'))
    process.exit(0)
  }

  // interactive select if not provided
  let selectedType = type as ItemType
  if (!selectedType) {
    selectedType = (await select({
      message: 'Select type',
      options: [
        { value: 'skills', label: 'Skills' },
        { value: 'workflows', label: 'Workflows' },
        { value: 'rules', label: 'Rules' },
        { value: 'mcps', label: 'MCPs' },
      ],
    })) as ItemType
  }

  let selectedName = name
  if (!selectedName) {
    const items = await listItems(selectedType)
    if (items.length === 0) {
      console.log(pc.yellow(`No ${selectedType} found.`))
      process.exit(0)
    }
    selectedName = (await select({
      message: `Select ${selectedType.slice(0, -1)}`,
      options: items.map(i => ({ value: i, label: i })),
    })) as string
  }

  const itemPath = await getItemPath(selectedType, selectedName)

  if (!(await fs.pathExists(itemPath))) {
    console.log(pc.red(`Not found: ${selectedName}`))
    process.exit(1)
  }

  const stat = await fs.stat(itemPath)

  if (stat.isFile()) {
    const content = await fs.readFile(itemPath, 'utf-8')
    console.log('\n' + content)
  } else {
    // folder: list files
    const files = await fs.readdir(itemPath)
    console.log(pc.bold(`\nFiles in ${selectedName}:`))
    files.forEach(f => console.log(`  ${pc.green('•')} ${f}`))
  }

  outro('')
}
