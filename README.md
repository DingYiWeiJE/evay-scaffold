# 脚手架开发

# 创建脚手架

创建npm项目

创建脚手架入口文件  bin/index.js

```
#!/usr/bin/env node
```

npm init -y 初始化项目

```json
{
  "name": "evay-scaffold",
  "version": "1.0.0",
  "description": "a scaffold test",
  "bin": {
    "evay-scaffold": "bin/inex.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

npm login 然后 npm publish 就可以把包发布上去了



# 进行本地调试

```
npm remove -g evay-scaffold
```

在本地项目当中

```
npm link
```





## 多包联接

首先在需要被链接的包中，

```
npm link
```

然后在主包中

```
npm link evay-scaffold-lib
```

因为这个包没有发布到远程

所以 npm install evay-scaffold-lib  是安装不了的

需要手动在package.json中添加依赖,手动指定版本号

```json
"dependencies": {
	"evay-scaffold-lib" : "^1.0.0"
}
```



## 解除本地调试

首先要把link断掉

```
npm unlink evay-scaffold-lib
```

然后在evay-scaffold项目中

```node
npm remove evay-scaffold-lib
```

然后安装

```js
npm i -S evay-scaffold-lib
```



## 解除本地主程序的调试

```
npm unlink evay-scaffold
npm remove -g evay-scaffold
npm install -g evay-scaffold
```



## File链接本地库

```json
"dependencies": {
    "evay-scaffold-lib": "file:../evay-scaffold-lib",
    "npmlog": "^7.0.1",
    "yargs": "^17.7.2"
  },
```

先在package.json中写好 file路径

然后运行npm install

这个时候就达到npm link 的效果了



# 命令注册和参数解析

`process` 模块是 Node.js 提供的一个核心模块，它包含了与当前 Node.js 进程（程序）的相关信息和控制功能

## 获取到命令参数

```js
const argv = require('process').argv
const command = argv[2]
```

```js
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


```





# yargs

```
npm i -S yargs
```

配置

````js
#!/usr/bin/env node

const yargs = require('yargs');
const dedent = require('dedent'); // 用来去除字符串中的换行符
const {hideBin} = require('yargs/helpers');

const arg = hideBin(process.argv);

const cli = yargs(arg)

cli
  // 语言设置 如果不设置，就是按照当地语言自适应
  .locale('en')
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
      console.log(argv)
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
  .argv;
````

##  command

```js
// 添加指令 command
  // 第一个参数 command 的格式
  // 第二个参数 command 的描述
  // 第三个参数 command 的配置 在执行这个command之前做的一些事情，这个函数会吧yargs对象传进去
  // 第四个参数 command 的回调函数 具体执行command的行为 
  .command('init [name]', 'create a new evay-scaffold project', (yargs) => {
    yargs.option('name', {
      type: 'string',
      describe: 'name of the project',
      alias: 'n'
    })
  }, (argv) => {
    console.log(argv)
  })
```

**运行**

```
dingyiwei@EvaydeMacBook-Pro evay-scaffold % evay-scaffold init -V -d -n dingkaile
{
  _: [ 'init' ],
  V: true,
  verbose: true,
  d: true,
  debug: true,
  n: 'dingkaile',
  name: 'dingkaile',
  '$0': 'evay-scaffold'
}
```

另一种写法：

```js
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
```

## 添加自定义参数

```js
// 解析参数，并将这些参数传入给arg
  // .argv;
  // 如果想要自定义的添加一些默认参数，就不要用.argv
  .parse(argv, context)
```

```shell
dingyiwei@EvaydeMacBook-Pro evay-scaffold % evay-scaffold init dingkaile
{
  _: [ 'init' ],
  evayVersion: '1.0.1',
  '$0': 'evay-scaffold',
  name: 'dingkaile',
  n: 'dingkaile'
}
dingyiwei@EvaydeMacBook-Pro evay-scaffold % 

```

这样就在每一个命令当中都提供evayVersion: '1.0.1', 参数信息

# lerna源码心得

