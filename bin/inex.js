#!/usr/bin/env node

const lib = require('evay-scaffold-lib')
const argv = require('process').argv
const command = argv[2]
const options = argv.slice(3)

if (options.length > 0) {
  if (command) {
    if (lib[command]) {
      lib[command](...argv.slice(3))
    } else {
      console.log('无效的命令')
    }
  } else {
    console.log('请输入命令')
  }
}

if (command.startsWith('--') || command.startsWith('-')) {
  const globalOption = command.replace(/--|-/g, '')
  if (globalOption === 'version' || globalOption === 'v') {
    console.log('1.0.0')
  }
}

