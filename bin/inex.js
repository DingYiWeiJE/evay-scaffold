#!/usr/bin/env node

const yargs = require('yargs');
const dedent = require('dedent'); // 用来去除字符串中的换行符
const pkg = require('../package.json');
const {hideBin} = require('yargs/helpers');
const log = require("npmlog");

const arg = hideBin(process.argv);
const argv = process.argv.slice(2);
const cli = yargs(arg)

const context = {
  evayVersion: pkg.version,
}

require('evay-scaffold-lib').sum(3, 6)


cli
  // 语言设置 如果不设置，就是按照当地语言自适应
  .locale('en')
  // 如果没有匹配到命令，则推荐相似的命令
  .recommendCommands()
  // 命令输入错误时候的处理
  .fail((err) => {
    log.error('error', err)
  })
  // 限制至少需要输入几个命令值。如果加了这个，在没有输入指令的时候，就会在控制台中有所提示
  .demandCommand(1, 'A command is required. Pass --help to see all available commands and options')
  .usage('Usage: evay-scaffold [command] [options]')
  .strict()
  // 取别名
  .alias('h', 'help')
  .alias('v', 'version')
  // 设置命令窗口宽度，默认是80
  .wrap(cli.terminalWidth())
  // 命令行使用说明的结尾部分
  .epilogue(dedent`
    When a command fails,  all logs are written to a file in ~/.evay-scaffold/logs
    For more information, find our manual at https://github.com/DingYiWeiJE/evay-scaffold
  `)
  // 添加命令集合
  .options({
    'debug': {
      type: 'boolean',
      describe: 'display any useful debug information',
      alias: 'd'
    },
    'quiet': {
      type: 'boolean',
      // 隐藏该命令, 通常是在开发过程中使用，不对用户暴露
      hidden: true,
      describe: 'suppress output except warnings and errors',
      alias: 'q'
    },
    
  })
  // 单个的添加命令
  .option('verbose', {
    type: 'boolean',
    describe: 'enable verbose output',
    alias: 'V'
  })
  // 对指令进行分类，前者是指令的数组，后者是分类的名称
  .group(['verbose', 'debug'], 'Development:')
  .group(['version'], 'Config:')
  // 添加指令 command
  // 第一个参数 command 的格式
  // 第二个参数 command 的描述
  // 第三个参数 command 的配置 在执行这个command之前做的一些事情，这个函数会吧yargs对象传进去
  // 第四个参数 command 的回调函数 具体执行command的行为 
  .command(
    'init [name]', 
    'create a new evay-scaffold project', 
    (yargs) => {
      yargs.option('name', {
        type: 'string',
        describe: 'name of the project',
        alias: 'n'
      })
    },
    (argv) => {
      console.log('进行初始化的项目名称是：',argv.name)
    }
  )
  // 另一种书写方式：
  .command({
    command: 'list',
    // 同时取多个别名
    aliases: ['ll', 'ls', 'la'],
    describe: 'List local packages',
    builder: (yargs) => {
    },
    handler: (argv) => {
      console.log(argv)
    }
  })
  .command({
    command: 'event-loop',
    // 同时取多个别名
    aliases: ['ev'],
    describe: 'event loop test',
    builder: (yargs) => {
    },
    handler: (argv) => {
      console.log(argv)
      console.log('start')
      setTimeout(() => {
        console.log('setTimeout')
      })
      new Promise(() => {
        let chain = Promise.resolve()
        for (let i = 0; i < 3; i++) {
          chain = chain.then(() => {
            console.log(`inside chain ${i}`)
          })
        }
        // chain.then(() => {
        //   console.log(`inside chain 1`)
        // })
        // chain.then(() => {
        //   console.log(`inside chain 2`)
        // })
        // chain.then(() => {
        //   console.log(`inside chain 3`)
        // })
      })
      let chain = Promise.resolve()
      chain.then(() => {
        console.log('outside chain')
      })
      console.log('end');
      
    }
  })
  // 解析参数，并将这些参数传入给arg
  // .argv;
  // 如果想要自定义的添加一些默认参数，就不要用.argv
  .parse(argv, context)