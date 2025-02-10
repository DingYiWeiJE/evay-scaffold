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

## importLocal

**目的：** 当全局安装了一个lerna；然后当前文件夹也安装了一个lerna的时候；这个时候运行lerna。 能够就近原则，指向当前文件夹下的lerna



### pkg-dir

```js
const pkgDir = require('pkg-dir');

const globalDir = pkgDir.sync(path.dirname(filename));
```

pkgDir 会获取到包含package.json的上级目录， 因为有时候源码可能放在bin当中或者lib当中。它会逐级向上找，一直找到package.json的目录



```js
const findUp = require('find-up');

const fp = findUp.sync('package.json', {cwd})
```

通过findup这个库来找到package.json的所在目录



```js
const locatePath = require('locate-path');

const file = locatePath.sync(filenames, {cwd: dir});
```

通过locatePath这个库来寻找当前目录下是否有这个文件存在



```js
const pathExists = require('path-exists');

pathExists.sync(path.resolve(options.cwd, el)
```

通过pathExists 去判定package.json是否存在于当前目录之下



#### 抛出同步函数

```js
module.exports.sync = () => {....}
```

库中这种方式抛出的函数是同步函数，接收到的不会是一个promise

### 获取文件所在的文件夹

```js
path.dirname("文件路径")
```

### path.resolve

想要获取到当前目录直接 path.resolve('.') 就可以了

```js
path.resolve('/Users', '/sam', '..')   // '/'
```

这相当于一个cd的过程，

```shell
cd  /Users

cd /sam

cd ..
```

所以结果是  `D:`







```js
path.resolve('bar', 'doof', 'twxt.txt')
```

相当于在当前的文件夹目录下，拼接\bar\doof\twxt.txt

所以结果是`D:\学无止境\lerna_source_code_reading\bar\doof\twxt.txt`



```js
path.resolve('bar', '/doof', 'dingkaile', 'jiao',"..", 'twxt.txt')
```

相当于先在当前目录中拼接了 bar

然后cd  /doof

这样就丢失了bar

接着拼接dingkaile/jiao

然后.. 又返回了上一层目录   dingkaile

最后拼接 twxt.txt

结果是` D:\doof\dingkaile\twxt.txt`



### path.join

与 `path.resolve()` 不同，`path.join()` 主要用于生成相对路径，而 `path.resolve()` 会返回一个绝对路径。

也就是说不会在结果中的开始写上当前所在目录

遇到`/`或者`\`会忽略掉，而不是执行cd操作



```js
path.join('bar', '/doof', 'dingkaile', 'jiao',"..", 'twxt.txt')
```

结果是`bar\doof\dingkaile\twxt.txt`

```js
path.join('bar', 'doof', 'twxt.txt')
```

结果是 `bar\doof\twxt.txt`

```js
path.join('/Users', '/sam', '..')
```

结果是`\Users`
