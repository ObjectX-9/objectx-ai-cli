import simpleGit from 'simple-git'
import { REPO_URL, REPO_DIR, LOCAL_DIR } from './store'
import fs from 'fs-extra'

export async function cloneRepo(): Promise<void> {
  await fs.ensureDir(LOCAL_DIR)
  const git = simpleGit(LOCAL_DIR)
  await git.clone(REPO_URL)
}

export async function pullRepo(): Promise<void> {
  const git = simpleGit(REPO_DIR)
  await git.pull()
}

export async function pushChanges(message: string): Promise<void> {
  const git = simpleGit(REPO_DIR)
  await git.add('.')
  await git.commit(message)
  await git.push()
}
