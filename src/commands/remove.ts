import { intro, outro, select, confirm, spinner } from '@clack/prompts'
import pc from 'picocolors'
import fs from 'fs-extra'
import { listItems, getItemPath, isRepoCloned, ItemType } from '../store'
import { pushChanges } from '../git'

export async function removeCommand(type?: string, name?: string): Promise<void> {
  intro(pc.cyan('aimat remove'))

  if (!(await isRepoCloned())) {
    console.log(pc.yellow('No local data. Run `aimat pull` first.'))
    process.exit(0)
  }

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
      message: `Select ${selectedType.slice(0, -1)} to remove`,
      options: items.map(i => ({ value: i, label: i })),
    })) as string
  }

  const confirmed = await confirm({
    message: `Remove ${selectedName}? This will also delete it from GitHub.`,
  })

  if (!confirmed) {
    outro('Cancelled')
    return
  }

  const itemPath = await getItemPath(selectedType, selectedName)
  await fs.remove(itemPath)
  console.log(pc.green(`Removed ${selectedName}`))

  const s = spinner()
  s.start('Pushing to GitHub...')
  try {
    await pushChanges(`remove ${selectedType.slice(0, -1)}: ${selectedName}`)
    s.stop(pc.green('Pushed'))
  } catch (e: any) {
    s.stop(pc.red('Push failed: ' + e.message))
  }

  outro('Done')
}
