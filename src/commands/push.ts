import { intro, outro, text, spinner } from '@clack/prompts'
import pc from 'picocolors'
import { isRepoCloned } from '../store'
import { pushChanges } from '../git'

export async function pushCommand(message?: string): Promise<void> {
  intro(pc.cyan('aimat push'))

  if (!(await isRepoCloned())) {
    console.log(pc.yellow('No local data. Run `aimat pull` first.'))
    process.exit(0)
  }

  const msg = message ?? (await text({
    message: 'Commit message',
    defaultValue: 'update materials',
  })) as string

  const s = spinner()
  s.start('Pushing to GitHub...')
  try {
    await pushChanges(msg)
    s.stop(pc.green('Pushed successfully'))
  } catch (e: any) {
    s.stop(pc.red('Push failed: ' + e.message))
    process.exit(1)
  }

  outro('Done')
}
