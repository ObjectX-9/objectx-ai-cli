import * as path from 'path'
import * as os from 'os'
import fs from 'fs-extra'

export const REPO_URL = 'git@github.com:ObjectX-9/AI-Material.git'
export const LOCAL_DIR = path.join(os.homedir(), '.aimat')
export const REPO_DIR = path.join(LOCAL_DIR, 'AI-Material')

export type ItemType = 'skills' | 'workflows' | 'rules' | 'mcps'

export function getTypeDir(type: ItemType): string {
  return path.join(REPO_DIR, type)
}

export async function isRepoCloned(): Promise<boolean> {
  return fs.pathExists(path.join(REPO_DIR, '.git'))
}

export async function listItems(type: ItemType): Promise<string[]> {
  const dir = getTypeDir(type)
  if (!(await fs.pathExists(dir))) return []

  const entries = await fs.readdir(dir, { withFileTypes: true })

  if (type === 'workflows') {
    return entries
      .filter(e => e.isFile() && e.name.endsWith('.md'))
      .map(e => e.name.replace('.md', ''))
  }

  if (type === 'mcps') {
    return entries
      .filter(e => e.isFile() && e.name.endsWith('.json'))
      .map(e => e.name.replace('.json', ''))
  }

  // skills and rules are folders
  return entries.filter(e => e.isDirectory()).map(e => e.name)
}

export async function getItemDescription(type: ItemType, name: string): Promise<string> {
  try {
    if (type === 'workflows') {
      const filePath = path.join(getTypeDir(type), `${name}.md`)
      const content = await fs.readFile(filePath, 'utf-8')
      // 取第一个非标题、非空的行
      const line = content.split('\n').find(l => l.trim() && !l.startsWith('#'))
      return line?.trim() ?? ''
    }
    if (type === 'mcps') {
      const filePath = path.join(getTypeDir(type), `${name}.json`)
      const json = await fs.readJson(filePath)
      return json.description ?? Object.keys(json.mcpServers ?? {}).join(', ')
    }
    // skills / rules: 读 README.md 第一个非标题行
    const readme = path.join(getTypeDir(type), name, 'README.md')
    if (await fs.pathExists(readme)) {
      const content = await fs.readFile(readme, 'utf-8')
      const line = content.split('\n').find(l => l.trim() && !l.startsWith('#'))
      return line?.trim() ?? ''
    }
  } catch {}
  return ''
}

export async function getItemPath(type: ItemType, name: string): Promise<string> {
  if (type === 'workflows') {
    return path.join(getTypeDir(type), `${name}.md`)
  }
  if (type === 'mcps') {
    return path.join(getTypeDir(type), `${name}.json`)
  }
  return path.join(getTypeDir(type), name)
}
