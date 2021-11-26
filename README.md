# webpack-react

webpack5 从 0 到 1 搭建一个 react 项目

## 一、webpack 项目初始化

新建项目，在根目录初始化创建默认的 *package.json*：

```bash
yarn init -y
```

安装 webpack（模块打包库）和 webpack-cli（命令行工具）：

```bash
yarn add webpack webpack-cli -D
```

## 二、webpack 基础配置

在根目录下新建一个 *webpack.config.js*：

### 1、准备入口文件

在 src 下新建 *index.js* 文件作为入口文件。

### 2、配置 Entry 和 Output

```js
// webpack.config.js

const path = require('path')

module.exports = {
  // 入口文件，webpack 会首先从这里开始编译
  entry: {
    app: './src/index.js'
  },
  // 定义了打包后输出的位置，以及对应的文件名
  output: {
    path: path.resolve(__dirname, './dist'),
    // [name] 是个占位符，等价于 entry 中定义的 key 值，即 app
    filename: '[name].bundle.js'
  }
}
```

### 3、配置运行命令

在 *package.json* 中加入以下运行命令：

```js
"scripts": {
  "build": "webpack"
}
```

运行 `yarn build` 命令，可以在命令行中看到打包的结果，并且在根目录下生成了 dist 目录，说明打包成功。

## 三、webpack plugins 配置

### 1、生成模板文件

构建一个 webapp 时，需要一个 HTML 页，然后在其中引入 Javascript，最好是可以自动将 bundle 打包进 HTML 中。

这里使用 [HtmlWebpackPlugin](https://www.webpackjs.com/plugins/html-webpack-plugin/) 插件来生成 HTML 文件：

```bash
yarn add html-webpack-plugin -D
```

在根目录下新建 *public/index.html*：

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <title><%= htmlWebpackPlugin.options.title %></title>
</head>

<body>
  <div id="root">123</div>
</body>

</html>
```

其中 title 是读取 *html-webpack-plugin* 插件的配置，配置如下：

```js
// webpack.config.js

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  /* ... */

  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack 搭建 react 项目',
      template: path.resolve(__dirname, './public/index.html'),
      filename: 'index.html'
    })
  ]
}
```

再次运行 `yarn build`，可以看到 dist 下多了一个 index.html，其中自动插入了标题和 script：

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <title>webpack 搭建 react 项目</title>
<script defer src="app.bundle.js"></script></head>

<body>
  <div id="root">123</div>
</body>

</html>
```

### 2、打包前自动清理打包目录

使用 [CleanPluginForWebpack](https://github.com/johnagan/clean-webpack-plugin) 在每次打包前先删除 dist 文件夹：

```bash
yarn add clean-webpack-plugin -D
```

```js
// webpack.config.js

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  /* ... */

  plugins: [
    /* ... */
    new CleanWebpackPlugin()
  ]
}
```

### 3、友好的命令行提示

[FriendlyErrorsWebpackPlugin](https://github.com/geowarin/friendly-errors-webpack-plugin) 可以识别 webpack 中的类别错误，提供友好的命令行提示。

```bash
yarn add friendly-errors-webpack-plugin -D
```

```js
// webpack.config.js

const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

module.exports = {
  plugins: [
    new friendlyErrorsWebpackPlugin()
  ]
}
```

## 四、webpack loaders 配置

在项目中只有 HTML 和 Javascript 是没什么用的，还需要 webpack 做一些事：

- 可以编译 Javascript 新特性；
- 可以编译注入 css；
- 可以导入图片、字体等静态资源；

### 1、安装 Babel

用 Babel 将 ES6 转为 ES5，解决最新语言特性的兼容性问题，并且通过插件机制根据需求灵活的扩展：

```bash
yarn add babel-loader @babel/core @babel/preset-env -D
```

- *babel-loader*：使用 Babel 和 webpack 转译文件；
- *@babel/core*：Babel 的核心功能包含在该模块中；
- *@babel/preset-env*：智能预设，用于支持所有最新的 JS 特性。

配置如下：

```js
// webpack.config.js

module.exports = {
  /* ... */

  module: {
    rules: [
      // JavaScript
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
```

在 Babel 执行编译的过程中，会从项目根目录下的配置文件读取配置，需要在根目录下创建 Babel 的配置文件 *babel.config.json*：

```json
{
  "presets": ["@babel/preset-env"]
}
```

### 2、编译注入 css

现在要能在 Javascript 中导入 CSS、将 CSS 注入 DOM，还要使用 CSS 的最新特性（如 cssnext），需要使用相关库：

```bash
yarn add css-loader style-loader postcss-loader postcss-preset-env postcss postcss-cssnext -D
```

- *css-loader*：解析 CSS 导入；
- *style-loader*：将 CSS 注入 DOM；
- *postcss-loader*：用 PostCSS 处理 CSS；
- *postcss-preset-env*：PostCSS 的默认配置；
- *postcss*：使用 JS 插件转换样式的工具，可检查及编译 CSS；
- *postcss-next*：PostCSS 的插件，可使用 CSS 最新语法。

配置 webpack：

```js
// webpack.config.js

module.exports = {
  /* ... */
  module: {
    rules: [
      // CSS, PostCSS, and Sass
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      }
    ]
  }
}
```

新建 PostCSS 配置文件 *postcss.config.js*：

```js
// postcss.config.js

module.exports = {
  plugins: {
    'postcss-preset-env': {
      browsers: 'last 2 versions'
    }
  }
}
```

[点击查看编译注入 css 效果测试](https://www.webpackjs.com/guides/asset-management/#%E5%8A%A0%E8%BD%BD-css)

### 3、加载图片和字体等静态资源

#### 3-1、webpack 5 之前的方式

在 webpack 5 之前，通常使用资源模块（asset module）来加载静态文件：

- `raw-loader`：将文件导入为字符串；
- `url-loader`：将文件作为 data URI 内联到 bundle 中；
- `file-loader`：将文件发送到输出目录；

使用方式如下：

```bash
yarn add file-loader -D
```

配置 webpack：

```js
// webpack.config.js

module.exports = {
  /* ... */
  module: {
    rules: [
      // 加载图片资源
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      // 加载字体资源
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          // 可以在 options 的 outputPath 中指定输出文件位置
          {
            loader: 'file-loader',
            options: {
              outputPath: './fonts'
            }
          }
        ]
      },
      {
        test: /\.ico$/i,
        use: 'url-loader'
      },
      {
        test: /\.text$/i,
        use: 'raw-loader'
      }
    ]
  }
}
```

[点击查看加载静态资源效果测试](https://www.webpackjs.com/guides/asset-management/#%E5%8A%A0%E8%BD%BD%E5%9B%BE%E7%89%87)

#### 3-2、webpack 5 之后的方式

webpack 5 之后采用资源模块类型（asset module type）来替换所有这些 loader：

- `asset/resource`：发送一个单独的文件并导出 URL。用来替代 *file-loader*；
- `asset/inline`：导出一个资源的 data URI。用来替代 *url-loader*。
- `asset/source`：导出资源的源代码。用来替代 *raw-loader*。
- `asset`：在导出一个 data URI 和发送一个单独的文件之间自动选择。用来替代 *url-loader*。

使用方式如下：

```js
// webpack.config.js

module.exports = {
  /* ... */
  module: {
    rules: [
      // 加载图片资源
      {
        test: /\.(png|svg|jpg|gif)$/,
        type: 'asset/resource'
      },
      // 加载字体资源
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/inline'
      },
      {
        test: /\.ico$/i,
        use: 'asset/inline'
      },
      {
        test: /\.text$/i,
        use: 'asset/source'
      }
    ]
  }
}
```

## 五、开发环境配置优化

### 1、选择 mode 模式

```js
// webpack.config.js

module.exports = {
  mode: 'development'
  // ...
}
```

### 2、source map 追踪报错代码

使用 [source map](https://www.webpackjs.com/guides/development/#%E4%BD%BF%E7%94%A8-source-map) 可以在报错时更好的追踪代码和提示错误代码出现的地方，配置如下：

```js
// webpack.config.js

module.exports = {
  devtool: 'inline-source-map'
  // ...
}
```

### 3、启用 HMR 模块热替换

安装 webpack-dev-server 实现自动编译/刷新：

```bash
yarn add webpack-dev-server -D
```

webpack 配置如下：

```js
// webpack.config.js

module.exports = {
  // ...
  devServer: {
    open: true,
    hot: true,
    port: 8080
  }
}
```

补充运行命令：

```diff
 {
   // ...
   "scripts": {
+    "start": "webpack serve",
     "build": "webpack",
+    "watch": "webpack --watch"
   },
   // ...
 }
```

到这里，watch 监听模式和 HMR 就启用完成了。

## 六、使用 TypeScript

```bash
yarn add typescript ts-loader -D
```

webpack 配置 tsx：

```js
// webpack.config.js

module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
}
```

然后在根目录下创建 ts 的配置文件 *tsconfig.json*：

```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    // "rootDir": "./src",
    "sourceMap": true, // 开启 sourcemap
    "module": "commonjs",
    "target": "es5",
    "jsx": "react",
    "esModuleInterop": true,
    "allowJs": true,
    "strict": true
  }
}
```

## 七、使用 React

```bash
yarn add react react-dom @types/react @types/react-dom
```

然后将入口文件改成 *.tsx* 后缀（webpack 配置文件中要同步）：

```tsx
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import webpackImg from './assets/webpack.png'

const App = () => {
  return <>
    <div>
      welcome to webpack react project.
      <img src={webpackImg} alt="webpack" />
    </div>
  </>;
};

ReactDOM.render(<App />, document.getElementById('root'));
```

使用 ts 引入图片文件可能会报以下错误：

<img src="http://tva1.sinaimg.cn/large/0068vjfvgy1gwsmr65paoj31hy01o41e.jpg" width="1200" referrerPolicy="no-referrer" />

这是因为 typscript 中无法识别非代码资源的，需要在 *tsconfig.json* 中 include 属性所配置的文件夹下添加 ts 声明文件，如 *images.d.ts*：

```ts
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
```

## 八、配置代码规范

### 1、Prettier

Prettier 是一个诞生于 2016年的代码格式化的工具，只关注格式化，并不具有 lint 检查语法等能力。配合 ESLint 可以在 ESLint 格式化基础上做一个很好的补充。

#### Prettier 使用方式

以 VSCode 为例，安装 Prettier 插件即可使用。

### 2、Eslint

ESLint 是一个在 JavaScript 代码中通过规则模式匹配作代码识别和报告的插件化的检测工具，它的目的是保证代码规范的一致性和及时发现代码问题、提前避免错误发生。

ESLint 关注的是代码质量，检查代码风格并且会提示不符合风格规范的代码。除此之外 ESLint 也具有一部分代码格式化的功能。

#### ESLint 使用方式

[umi-fabric](https://github.com/umijs/fabric) 库提供了 eslint、stylelint 和 prettier 的一些预设：

```bash
yarn add @umijs/fabric -D
```

在项目根目录下新建 *.eslintrc.js*：

```js
module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {},
  plugins: ['react-hooks'],
  rules: {
    'no-restricted-syntax': 0,
    'no-param-reassign': 0,
    'no-unused-expressions': 0
  }
}
```

重启编辑器，即可应用 Eslint 配置。
