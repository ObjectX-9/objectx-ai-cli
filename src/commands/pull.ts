import { intro, outro, spinner } from '@clack/prompts'
import pc from 'picocolors'
import { isRepoCloned } from '../store'
import { cloneRepo, pullRepo } from '../git'

export async function pullCommand(): Promise<void> {
  intro(pc.cyan('aimat pull'))

  const s = spinner()
  const cloned = await isRepoCloned()

  if (!cloned) {
    s.start('Cloning AI-Material repo...')
    try {
      await cloneRepo()
      s.stop(pc.green('Cloned successfully'))
    } catch (e: any) {
      s.stop(pc.red('Clone failed: ' + e.message))
      process.exit(1)
    }
  } else {
    s.start('Pulling latest changes...')
    try {
      await pullRepo()
      s.stop(pc.green('Up to date'))
    } catch (e: any) {
      s.stop(pc.red('Pull failed: ' + e.message))
      process.exit(1)
    }
  }

  outro('Done')
}
