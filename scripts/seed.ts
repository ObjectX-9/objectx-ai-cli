import fs from 'fs-extra'
import * as path from 'path'
import simpleGit from 'simple-git'

const SEED_DIR = path.join(__dirname, '../seed')
const REPO_DIR = path.join(process.env.HOME!, '.aimat/AI-Material')

async function main() {
  console.log('Copying seed data to', REPO_DIR)
  await fs.copy(SEED_DIR, REPO_DIR, { overwrite: false })

  console.log('Pushing to GitHub...')
  const git = simpleGit(REPO_DIR)
  await git.add('.')
  await git.commit('chore: add seed data')
  await git.push()

  console.log('Done.')
}

main().catch(console.error)
