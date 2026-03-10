#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const pull_1 = require("./commands/pull");
const list_1 = require("./commands/list");
const show_1 = require("./commands/show");
const add_1 = require("./commands/add");
const remove_1 = require("./commands/remove");
const push_1 = require("./commands/push");
const program = new commander_1.Command();
program
    .name('aimat')
    .description('Manage your AI skills, workflows and rules')
    .version('0.1.0');
program
    .command('pull')
    .description('Clone or pull latest content from GitHub')
    .action(pull_1.pullCommand);
program
    .command('list [type]')
    .description('List all items (or filter by type: skills | workflows | rules)')
    .action(list_1.listCommand);
program
    .command('show [type] [name]')
    .description('Show content of a skill/workflow/rule')
    .action(show_1.showCommand);
program
    .command('add [type] [name]')
    .description('Add a new skill/workflow/rule')
    .action(add_1.addCommand);
program
    .command('remove [type] [name]')
    .description('Remove a skill/workflow/rule')
    .action(remove_1.removeCommand);
program
    .command('push [message]')
    .description('Push local changes to GitHub')
    .action(push_1.pushCommand);
program.parse();
