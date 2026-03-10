#!/usr/bin/env node
import { Command } from 'commander'
import { pullCommand } from './commands/pull'
import { listCommand } from './commands/list'
import { showCommand } from './commands/show'
import { addCommand } from './commands/add'
import { removeCommand } from './commands/remove'
import { pushCommand } from './commands/push'

const program = new Command()

program
  .name('aimat')
  .description('Manage your AI skills, workflows and rules')
  .version('0.1.0')

program
  .command('pull')
  .description('Clone or pull latest content from GitHub')
  .action(pullCommand)

program
  .command('list [type]')
  .description('List all items (or filter by type: skills | workflows | rules)')
  .action(listCommand)

program
  .command('show [type] [name]')
  .description('Show content of a skill/workflow/rule')
  .action(showCommand)

program
  .command('add [type] [name]')
  .description('Add a new skill/workflow/rule')
  .action(addCommand)

program
  .command('remove [type] [name]')
  .description('Remove a skill/workflow/rule')
  .action(removeCommand)

program
  .command('push [message]')
  .description('Push local changes to GitHub')
  .action(pushCommand)

program.parse()
