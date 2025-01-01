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

