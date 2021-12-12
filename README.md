![IMG_5885](https://user-images.githubusercontent.com/12172868/145699258-517293e0-c5e1-474c-8ba6-7695b07cfac3.jpg)


说到 Vue 的组件库，大家肯定早已耳熟能详，随随便便就能列举出一大堆。那为什么还需要自己去搭建呢？结合自身的经验，在业务中往往需要高度定制化的组件，无论是 UI 和交互，可能都会跟市面上现有的组件库有着较大的出入。这个时候如果是基于现有的组件库进行修改的话，其理解成本和修改成本也不小，甚至比自己搭建一套还要高。因此搭建一套自己的组件库还是一个相当常见的需求。

对于一个组件库来说，除了”组件“本身以外，另个一个非常重要的东西就是文档展示。参考市面上优秀的开源组件库，无一不是既有高质量的组件，更有一套非常规范且详细的文档。文档除了对组件的功能进行说明以外，同时也具备了组件交互预览的能力，让用户的学习成本尽可能地降低。

对于许多程序员来说，最讨厌的无非是两件事。一件是别人不写文档，另一件是自己写文档。既然在组件库里文档是必不可少的，那么我们应该尽可能地减少写文档的痛苦，尤其是这种既要有代码展示、又要有文字说明的文档。

市面上对于组件文档展示的框架也有不少，比如 Story Book、Docz、Dumi 等等。它们都有一套自己的规则能够让你展示自己的组件，但是对于团队来说学习成本较高，同时它们也在一定程度上割裂了“开发”和“写文档”之间的体验。

如果在开发组件库的过程中能够一边开发一边预览调试，预览调试的内容就是文档的一部分就好了。开发者只需要关注组件本身的开发，然后再稍微补上一点必要的 API 和事件说明即可。

我们这次就要来搭建这么一套体验超级丝滑的组件库开发框架。先上一个最终成果的例子，随后再一步一步地教大家去实现。

![image](https://user-images.githubusercontent.com/12172868/145698677-3c34a45e-12b3-4686-8280-26b5ab46208c.png)


[在线体验
](https://jrainlau.github.io/MY-Kit/index.html#/components/Button)

[Github 仓库
](https://github.com/jrainlau/MY-Kit)

[演示视频](https://user-images.githubusercontent.com/12172868/145698280-730751be-a3f8-4989-abc2-dcf467362fb1.mp4)


## 一、开发框架初始化
这一套开发框架我们把它命名为 `MY-Kit`。在技术选型上使用的是 Vite + Vue3 + Typescript。

在空白目录执行下列命令：

```bash
yarn create vite
```

依次填写项目名称和选择框架为 vue-ts 后，将会自动完成项目的初始化，代码结构如下：

```bash
.
├── README.md
├── index.html
├── package.json
├── public
├── src
├── tsconfig.json
├── vite.config.ts
└── yarn.lock
```

在根目录下新建一个 `/packages` 目录，后续组件的开发都会在该目录进行。以一个 `<my-button />` 组件为例，看看 `/packages` 目录内部是什么样的：

```bash
packages
├── Button
│   ├── docs
│   │   ├── README.md  // 组件文档
│   │   └── demo.vue   // 交互式预览实例
│   ├── index.ts       // 模块导出文件
│   └── src
│       └── index.vue  // 组件本体
├── index.ts           // 组件库导出文件
└── list.json          // 组件列表
```

下面分别看看这些文件都是些什么内容。

---

 `packages/Button/src/index.vue`

该文件是组件的本体，代码如下：

```html
<template>
  <button class="my-button" @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
defineEmits(['click']);
</script>

<style scoped>
.my-button {
  // 样式部分省略
}
</style>
```

---

`packages/Button/index.ts`

为了让组件库既允许全局调用：
```js
import { createApp } from 'vue'
import App from './app.vue'

import MyKit from 'my-kit'

createApp(App).use(MyKit)

```

也允许局部调用：

```js
import { Button } from 'my-kit'

Vue.component('my-button', Button)
```

因此需要为每一个组件定义一个 `VuePlugin` 的引用方式。`package/Button/index.ts` 的内容如下：

```js
import { App, Plugin } from 'vue';
import Button from './src/index.vue';

export const ButtonPlugin: Plugin = {
  install(app: App) {
    app.component('q-button', Button);
  },
};

export { Button };
```

---

 `packages/index.ts`

该文件是作为组件库本身的导出文件，它默认导出了一个 `VuePlugin`，同时也导出了不同的组件：

```js
import { App, Plugin } from 'vue';

import { ButtonPlugin } from './Button';

const MyKitPlugin: Plugin = {
  install(app: App) {
    ButtonPlugin.install?.(app);
  },
};

export default MyKitPlugin;

export * from './Button';
```

---

`/packages/list.json`

最后就是组件库的一个记述文件，用来记录了它里面组件的各种说明，这个我们后面会用到：

```json
[
  {
    "compName": "Button",
    "compZhName": "按钮",
    "compDesc": "这是一个按钮",
    "compClassName": "button"
  }
]
```

---

完成了上述组件库目录的初始化以后，此时我们的 `MY-Kit` 是已经可以被业务侧直接使用了。

回到根目录下找到 `src/main.ts` 文件，我们把整个 `MY-Kit` 引入：
```js
import { createApp } from 'vue'
import App from './App.vue'

import MyKit from '../packages';

createApp(App).use(MyKit).mount('#app')

```
改写 `src/App.vue`，引入 `<my-button></my-button>` 试一下：

```html
<template>
  <my-button>我是自定义按钮</my-button>
</template>
```
运行 `yarn dev` 开启 Vite 的服务器以后，就可以直接在浏览器上看到效果了：

![image](https://user-images.githubusercontent.com/12172868/145666383-45294533-57f7-4226-9541-24aad4e6a977.png)

## 二、实时可交互式文档

![Kapture 2021-12-12 at 11 20 50](https://user-images.githubusercontent.com/12172868/145698937-f9b0df8e-1d2f-4ac0-af1f-14229ffea73c.gif)


一个组件库肯定不止有 Button 一种组件，每个组件都应该有它独立的文档。这个文档不仅有对组件各项功能的描述，更应该具有组件预览、组件代码查看等功能，我们可以把这种文档称之为“可交互式文档”。同时为了良好的组件开发体验，我们希望这个文档是实时的，这边修改代码，那边就可以在文档里实时地看到最新的效果。接下来我们就来实现这么一个功能。

组件的文档一般是用 Markdown 来写，在这里也不例外。我们希望一个 Markdown 一个页面，因此需要使用 `vue-router@next` 来实现路由控制。

在根目录的 `/src` 底下新建 `router.ts`，写入如下代码：
```js
import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router'

const routes = [{
  title: '按钮',
  name: 'Button',
  path: '/components/Button',
  component: () => import(`packages/Button/docs/README.md`),
}];

const routerConfig = {
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to: any, from: any) {
    if (to.path !== from.path) {
      return { top: 0 };
    }
  },
};

const router = createRouter(routerConfig as RouterOptions);

export default router;
```

可以看到这是一个典型的 `vue-router@next` 配置，细心的读者会发现这里为 path 为 `/components/Button` 的路由引入了一个 Markdown 文件，这个在默认的 Vite 配置里是无效的，我们需要引入 `vite-plugin-md` 插件来解析 Markdown 文件并把它变成 Vue 文件。回到根目录下找到 `vite.config.ts`，添加该插件：
```js
import Markdown from 'vite-plugin-md'

export default defineConfig({
  // 默认的配置
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    Markdown(),
  ],
})
```

这样配置以后，任意的 Markdown 文件都能像一个 Vue 文件一样被使用了。

回到 `/src/App.vue`，稍作改写，增加一个侧边栏和主区域：

```html
<template>
  <div class="my-kit-doc">
    <aside>
      <router-link v-for="(link, index) in data.links" :key="index" :to="link.path">{{ link.name }}</router-link>
    </aside>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import ComponentList from 'packages/list.json';
import { reactive } from 'vue'

const data = reactive({
  links: ComponentList.map(item => ({
    path: `/components/${item.compName}`,
    name: item.compZhName
  }))
})
</script>

<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
}
.my-kit-doc {
  display: flex;
  min-height: 100vh;
  aside {
    width: 200px;
    padding: 15px;
    border-right: 1px solid #ccc;
  }
  main {
    width: 100%;
    flex: 1;
    padding: 15px;
  }
}
</style>
```
最后我们往 `/packages/Button/docs/README.md` 里面随便写点东西：

```markdown
# 按钮组件

<my-button>我是自定义按钮</my-button>
```

完成以后就能在浏览器上看到效果了：
![image](https://user-images.githubusercontent.com/12172868/145666882-e80c2f35-00cb-4a32-ac4c-59e6302fc981.png)

由于我们全局引入了 `MY-Kit`，所以里面所注册的自定义组件都可以直接在 Markdown 文件中像普通 HTML 标签一样被写入并被正确渲染。但是这里也有另一个问题，就是这些组件都是静态的无事件的，无法执行 JS 逻辑。比如当我想要实现点击按钮触发 click 事件然后弹一个告警弹窗出来，是无法直接这么写的：

```markdown
# 按钮组件

<my-button @click="() => { alert(123) }">我是自定义按钮</my-button>
```

那怎么办呢？还记得刚刚引入的解析 Markdown 的插件 `vite-plugin-md` 吗？仔细看它的文档，它是支持在 Markdown 里面写 setup 函数的！因此我们可以把需要执行 JS 逻辑的代码封装成一个组件，然后在 Markdown 里通过 setup 来引入。

首先在 `packages/Button/docs` 目录下新建一个 `demo.vue`：

```html
<template>
  <div>
    <my-button @click="onClick(1)">第一个</my-button>
    <my-button @click="onClick(2)">第二个</my-button>
    <my-button @click="onClick(3)">第三个</my-button>
  </div>
</template>

<script setup>
const onClick = (num) => { console.log(`我是第 ${num} 个自定义按钮`) }
</script>
```

然后在 Markdown 里把它引进来：

```markdown
<script setup>
import demo from './demo.vue'
</script>

# 按钮组件

<demo />
```

最后就能实现点击响应了。
![Kapture 2021-12-11 at 14 43 53](https://user-images.githubusercontent.com/12172868/145667262-26cc82af-6910-47a7-8a92-7cd01f84b078.gif)

与此同时，如果我们对 `<my-button />` 的本体 Vue 文件进行任何的修改，都能够实时在文档中体现出来。

## 三、代码预览功能
可交互式文档已经基本弄好了，但还有一个问题，就是不能直观地预览代码。你可能会说，要预览代码很简单啊，直接在 Markdown 里面把代码贴进去不就好了？话虽如此并没有错，但是秉承着“偷懒才是第一生产力”，估计没有人喜欢把自己写过的代码再抄一遍，肯定是希望能够有个办法既能够在文档里把所写的 demo 展示出来，又能直接看到它的代码，比如说这样：

![Kapture 2021-12-12 at 11 26 58](https://user-images.githubusercontent.com/12172868/145699113-9702528d-38ab-495a-9da2-78fd157dd7be.gif)


只要把组件放进一个 `<Preview />` 标签内就能直接展示组件的代码，同时还具有代码高亮的功能，这才是可交互式文档真正具备的样子！接下来我们就来研究一下应该如何实现这个功能。

在 Vite 的[开发文档](https://cn.vitejs.dev/guide/assets.html#importing-asset-as-string)里有记载到，它支持在资源的末尾加上一个后缀来控制所引入资源的类型。比如可以通过 `import xx from 'xx?raw'` 以字符串形式引入 xx 文件。基于这个能力，我们可以在 `<Preview />` 组件中获取所需要展示的文件源码。

首先来新建一个 `Preview.vue` 文件，其核心内容是通过 Props 拿到源码的路径，然后通过动态 import 的方式把源码拿到。以下展示核心代码（模板部分暂时略过）

```js
export default {
  props: {
    /** 组件名称 */
    compName: {
      type: String,
      default: '',
      require: true,
    },
    /** 要显示代码的组件 */
    demoName: {
      type: String,
      default: '',
      require: true,
    },
  },
  data() {
    return {
      sourceCode: '',
    };
  },
  mounted() {
    this.sourceCode = (
      await import(/* @vite-ignore */ `../../packages/${this.compName}/docs/${this.demoName}.vue?raw`)
    ).default;
  }
}
```

这里需要加 `@vite-ignore` 的注释是因为 Vite 基于 Rollup，在 Rollup 当中动态 import 是被要求传入确定的路径，不能是这种动态拼接的路径。具体原因和其静态分析有关，感兴趣的同学可以自行搜索了解。此处加上该注释则会忽略 Rollup 的要求而直接支持该写法。

但是这样的写法在 dev 模式下可用，待真正执行 build 构建了以后再运行会发现报错。其原因也是同样的，由于 Rollup 无法进行静态分析，因此它无法在构建阶段处理需要动态 import 的文件，导致会出现找不到对应资源的情况。这个问题截止到目前（2021.12.11）暂时没有好的办法，只好判断环境变量，在 build 模式下通过 `fetch` 请求文件的源码来绕过。改写后如下：

```js
const isDev = import.meta.env.MODE === 'development';

if (isDev) {
  this.sourceCode = (
    await import(/* @vite-ignore */ `../../packages/${this.compName}/docs/${this.demoName}.vue?raw`)
  ).default;
} else {
  this.sourceCode = await fetch(`/packages/${this.compName}/docs/${this.demoName}.vue`).then((res) => res.text());
}
```

> 假设构建后的输出目录为 `/docs`，记得在构建后也要把 `/packages` 目录复制过去，否则在 build 模式下运行会出现 404 的情况。

可能又有同学会问，为什么要这么麻烦，直接在 dev 模式下也走 `fetch` 请求的方式不行么？答案是不行，因为在 Vite 的 dev 模式下，它本来就是通过 http 请求去拉取文件资源并处理完了才给到了业务的那一层。因此在 dev 模式下通过 `fetch` 拿到的 Vue 文件源码是已经被 Vite 给处理过的。

拿到了源码以后，只需要展示出来即可：

```html
<template>
  <pre>{{ sourceCode }}</pre>
</template>
```

![image](https://user-images.githubusercontent.com/12172868/145676612-0f83b2f1-40b2-4574-a8b7-7762da808130.png)


但是这样的源码展示非常丑，只有干巴巴的字符，我们有必要给它们加个高亮。高亮的方案我选择了 PrismJS，它非常小巧又灵活，只需要引入一个相关的 CSS 主题文件，然后执行 `Prism.highlightAll()` 即可。本例所使用的 CSS 主题文件[已经放置在仓库](https://github.com/jrainlau/MY-Kit/blob/main/src/assets/prism.css)，可以自行取用。

回到项目，执行 `yarn add prismjs -D` 安装 PrismJS，然后在 `<Preview />` 组件中引入：

```js
import Prism from 'prismjs';
import '../assets/prism.css'; // 主题 CSS

export default {
  // ...省略...
  async mounted() {
    // ...省略...
    await this.$nextTick(); // 确保在源码都渲染好了以后再执行高亮
    Prism.highlightAll();
  },
}
```

由于 PrismJS 没有支持 Vue 文件的声明，因此 Vue 的源码高亮是通过将其设置为 HTML 类型来实现的。在 `<Preview />` 组件的模板中我们直接指定源码的类型为 HTML：

```html
<pre class="language-html"><code class="language-html">{{ sourceCode }}</code></pre>
```

![image](https://user-images.githubusercontent.com/12172868/145676809-caf4d71d-7cd6-48e3-bb2b-a1f01be9d3f9.png)

这样调整了以后，PrismJS 就会自动高亮源码了。

## 四、命令式新建组件
到目前为止，我们的整个“实时可交互式文档”已经搭建完了，是不是意味着可以交付给其他同学进行真正的组件开发了呢？假设你是另一个开发同学，我跟你说：“你只要在这里，这里和这里新建这些文件，然后在这里和这里修改一下配置就可以新建一个组件了！”你会不会很想打人？作为组件开发者的你，并不想关心我的配置是怎样的，框架是怎么跑起来的，只希望能够在最短时间内就能够初始化一个新的组件然后着手开发。为了满足这个想法，我们有必要把之前处理的步骤变得更加自动化一些，学习成本更低一些。

国际惯例，先看完成效果再看实现方式：
![Kapture 2021-12-11 at 22 30 07](https://user-images.githubusercontent.com/12172868/145680315-8a32f14f-828c-4715-883d-2a205c9e0661.gif)

从效果图可以看到，在终端回答了三个问题后，自动就生成了一个新的组件 `Foo`。与此同时，无论是新建文件还是修改配置都是一键完成，完全不需要人工干预，接下来的工作只需要围绕 `Foo` 这一个新组件开展即可。我们可以把这种一键生成组件的方式成为“命令式新建组件”。

要实现这个功能，我们 `inquirer` 和 `handlebars` 这两个工具。前者用于创建交互式终端提出问题并收集答案；后者用于根据模板生成内容。我们首先来做交互式终端。

回到根目录下，新建 `/script/genNewComp` 目录，然后创建一个 `infoCollector.js` 文件：

```js
const inquirer = require('inquirer')
const fs = require('fs-extra')
const { resolve } = require('path')

const listFilePath = '../../packages/list.json'

// FooBar --> foo-bar
const kebabCase = string => string
  .replace(/([a-z])([A-Z])/g, "$1-$2")
  .replace(/[\s_]+/g, '-')
  .toLowerCase();

module.exports = async () => {
  const meta = await inquirer
    .prompt([
      {
        type: 'input',
        message: '请输入你要新建的组件名（纯英文，大写开头）：',
        name: 'compName',
      },
      {
        type: 'input',
        message: '请输入你要新建的组件名（中文）：',
        name: 'compZhName'
      },
      {
        type: 'input',
        message: '请输入组件的功能描述：',
        name: 'compDesc',
        default: '默认：这是一个新组件'
      }
    ])
  const { compName } = meta
  meta.compClassName = kebabCase(compName)
  return meta
}
```
通过 `node` 运行该文件时，会在终端内依次提出三个组件信息相关的问题，并把答案 `compName`（组件英文名），`compZhName` （组件中文名）和 `compDesc`（组件描述）保存在 `meta` 对象中并导出。

收集到了组件相关信息后，就要通过 `handlebars` 替换模板中的内容，生成或修改文件了。

在 `/script/genNewComp` 中新建一个 `.template` 目录，然后根据需要去建立新组件所需的所有文件的模板。在我们的框架中，一个组件的目录是这样的：

```bash
Foo
├── docs
│   ├── README.md
│   └── demo.vue
├── index.ts
└── src
    └── index.vue
```

一共是4个文件，因此需要新建 `index.ts.tpl`，`index.vue.tpl`，`README.md.tpl` 和 `demo.vue.tpl`。同时由于新组件需要一个新的路由，因此`router.ts` 也是需要一个对应的模板。由于篇幅关系就不全展示了，只挑最核心的 `index.ts.tpl` 来看看：

```html
import { App, Plugin } from 'vue';
import {{ compName }} from './src/index.vue';

export const {{ compName }}Plugin: Plugin = {
  install(app: App) {
    app.component('my-{{ compClassName }}', {{ compName }});
  },
};

export {
  {{ compName }},
};
```

位于双括号`{{}}` 中的内容最终会被 `handlebars` 所替换，比如我们已经得知一个新组件的信息如下：

```json
{
  "compName": "Button",
  "compZhName": "按钮",
  "compDesc": "这是一个按钮",
  "compClassName": "button"
}
```

那么模板 `index.ts.tpl` 最终会被替换成这样：

```js
import { App, Plugin } from 'vue';
import Button from './src/index.vue';

export const ButtonPlugin: Plugin = {
  install(app: App) {
    app.component('my-button', Button);
  },
};

export { Button };
```

模板替换的核心代码如下：
```js
const fs = require('fs-extra')
const handlebars = require('handlebars')
const { resolve } = require('path')

const installTsTplReplacer = (listFileContent) => {
  // 设置输入输出路径
  const installFileFrom = './.template/install.ts.tpl'
  const installFileTo = '../../packages/index.ts'

  // 读取模板内容
  const installFileTpl = fs.readFileSync(resolve(__dirname, installFileFrom), 'utf-8')

  // 根据传入的信息构造数据
  const installMeta = {
    importPlugins: listFileContent.map(({ compName }) => `import { ${compName}Plugin } from './${compName}';`).join('\n'),
    installPlugins: listFileContent.map(({ compName }) => `${compName}Plugin.install?.(app);`).join('\n    '),
    exportPlugins: listFileContent.map(({ compName }) => `export * from './${compName}'`).join('\n'),
  }

  // 使用 handlebars 替换模板内容
  const installFileContent = handlebars.compile(installFileTpl, { noEscape: true })(installMeta)

  // 渲染模板并输出至指定目录
  fs.outputFile(resolve(__dirname, installFileTo), installFileContent, err => {
    if (err) console.log(err)
  })
}
```
上述代码中的 `listFileContent` 即为 `/packages/list.json` 中的内容，这个 JSON 文件也是需要根据新组件而动态更新。

在完成了模板替换的相关逻辑后，就可以把它们都收归到一个可执行文件中了：

```js
const infoCollector = require('./infoCollector')
const tplReplacer = require('./tplReplacer')

async function run() {
  const meta = await infoCollector()
  tplReplacer(meta)
}

run()
```

新增一个 npm script 到 `package.json`：

```json
{
  "scripts": {
    "gen": "node ./script/genNewComp/index.js"
  },
}
```

接下来只要执行 `yarn gen` 就可以进入交互式终端，回答问题自动完成新建组件文件、修改配置的功能，并能够在可交互式文档中实时预览效果。

## 五、分开文档和库的构建逻辑
在默认的 Vite 配置中，执行 `yarn build` 所构建出来的产物是“可交互式文档网站”，并非“组件库”本身。为了构建一个 `my-kit` 组件库并发布到 npm，我们需要将构建的逻辑分开。

在根目录下添加一个 `/build` 目录，依次写入 `base.js`，`lib.js` 和 `doc.js`，分别为基础配置、库配置和文档配置。

---

`base.js`

基础配置，需要确定路径别名、配置 Vue 插件和 Markdown 插件用于对应文件的解析。
```js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Markdown from 'vite-plugin-md';

// 文档: https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      packages: resolve(__dirname, './packages'),
    },
  },
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    Markdown(),
  ],
});

```

---
`lib.js`

库构建，用于构建位于 `/packages` 目录的组件库，同时需要 `vite-plugin-dts` 来帮助把一些 TS 声明文件给打包出来。
```js
import baseConfig from './base.config';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  ...baseConfig,
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, '../packages/index.ts'),
      name: 'MYKit',
      fileName: (format) => `my-kit.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [
    ...baseConfig.plugins,
    dts(),
  ]
});
```

---

`doc.js`

交互式文档构建配置，跟 base 是几乎一样的，只需要修改输出目录为 `docs` 即可。
```js
import baseConfig from './vite.base.config';
import { defineConfig } from 'vite';

export default defineConfig({
  ...baseConfig,
  build: {
    outDir: 'docs',
  },
});

```
还记得前文有提到的构建文档时需要把 `/packages` 目录也一并复制到输出目录吗？亲测了好几个 Vite 的复制插件都不好使，干脆自己写一个：
```js
const child_process = require('child_process');

const copyDir = (src, dist) => {
  child_process.spawn('cp', ['-r', , src, dist]);
};

copyDir('./packages', './docs');
```

完成了上面这些构建配置以后，修改一下 npm script 即可：

```
"dev": "vite --config ./build/base.config.ts",
"build:lib": "vue-tsc --noEmit && vite build --config ./build/lib.config.ts",
"build:doc": "vue-tsc --noEmit && vite build --config ./build/doc.config.ts && node script/copyDir.js",
```

`build:lib` 的产物：
```bash
dist
├── my-kit.es.js
├── my-kit.umd.js
├── packages
│   ├── Button
│   │   ├── index.d.ts
│   │   └── src
│   │       └── index.vue.d.ts
│   ├── Foo
│   │   └── index.d.ts
│   └── index.d.ts
├── src
│   └── env.d.ts
└── style.css
```

`build:doc` 的产物：
```bash
docs
├── assets
│   ├── README.04f9b87a.js
│   ├── README.e8face78.js
│   ├── index.917a75eb.js
│   ├── index.f005ac77.css
│   └── vendor.234e3e3c.js
├── index.html
└── packages
```

大功告成！

## 六、尾声
至此我们的组件开发框架已经基本完成了，它具备了相对完整的代码开发、实时交互式文档、命令式新建组件等能力，在它上面开发组件已经拥有了超级丝滑的体验。当然它距离完美还有很长的距离，比如说单元测试、E2E测试等也还没集成进去，组件库的版本管理和 CHANGELOG 还需要接入，这些不完美的部分都很值得补充进去。本文纯当抛砖引玉，也期待更多的交流~