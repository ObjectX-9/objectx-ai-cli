import { intro, outro, select, text, spinner } from '@clack/prompts'
import pc from 'picocolors'
import fs from 'fs-extra'
import * as path from 'path'
import { getTypeDir, isRepoCloned, ItemType } from '../store'
import { pushChanges } from '../git'

export async function addCommand(type?: string, name?: string): Promise<void> {
  intro(pc.cyan('aimat add'))

  if (!(await isRepoCloned())) {
    console.log(pc.yellow('No local data. Run `aimat pull` first.'))
    process.exit(0)
  }

  let selectedType = type as ItemType
  if (!selectedType) {
    selectedType = (await select({
      message: 'Select type',
      options: [
        { value: 'skills', label: 'Skill (folder)' },
        { value: 'workflows', label: 'Workflow (markdown)' },
        { value: 'rules', label: 'Rule (folder)' },
        { value: 'mcps', label: 'MCP (json)' },
      ],
    })) as ItemType
  }

  const selectedName = name ?? (await text({
    message: `Name of the ${selectedType.slice(0, -1)}`,
    validate: v => (!v ? 'Name is required' : undefined),
  })) as string

  const typeDir = getTypeDir(selectedType)
  await fs.ensureDir(typeDir)

  if (selectedType === 'workflows') {
    const filePath = path.join(typeDir, `${selectedName}.md`)
    if (await fs.pathExists(filePath)) {
      console.log(pc.yellow(`${selectedName} already exists.`))
      process.exit(0)
    }
    await fs.writeFile(filePath, `# ${selectedName}\n\n`)
    console.log(pc.green(`Created ${filePath}`))
    console.log(pc.dim('Edit the file, then run `aimat push` to sync.'))
  } else if (selectedType === 'mcps') {
    const filePath = path.join(typeDir, `${selectedName}.json`)
    if (await fs.pathExists(filePath)) {
      console.log(pc.yellow(`${selectedName} already exists.`))
      process.exit(0)
    }
    const template = {
      mcpServers: {
        [selectedName]: {
          command: '',
          args: [],
          env: {}
        }
      }
    }
    await fs.writeFile(filePath, JSON.stringify(template, null, 2))
    console.log(pc.green(`Created ${filePath}`))
    console.log(pc.dim('Edit the JSON file, then run `aimat push` to sync.'))
  } else {
    const folderPath = path.join(typeDir, selectedName)
    if (await fs.pathExists(folderPath)) {
      console.log(pc.yellow(`${selectedName} already exists.`))
      process.exit(0)
    }
    await fs.ensureDir(folderPath)
    await fs.writeFile(path.join(folderPath, 'README.md'), `# ${selectedName}\n\n`)
    console.log(pc.green(`Created ${folderPath}/`))
    console.log(pc.dim('Add your files, then run `aimat push` to sync.'))
  }

  const s = spinner()
  s.start('Pushing to GitHub...')
  try {
    await pushChanges(`add ${selectedType.slice(0, -1)}: ${selectedName}`)
    s.stop(pc.green('Pushed'))
  } catch (e: any) {
    s.stop(pc.red('Push failed: ' + e.message))
  }

  outro('Done')
}
