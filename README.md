<h1 align="center">vite-plugin-fast-cdn-import </h1>
<p>
  <a href="https://www.npmjs.com/package/vite-plugin-fast-cdn-import" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/vite-plugin-fast-cdn-import.svg">
  </a>
  <a href="https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/actions?query=workflow%3ARelease" target="_blank">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/CaoMeiYouRen/vite-plugin-fast-cdn-import/Release">
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D12-blue.svg" />
  <a href="https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>


> 从多个 CDN 中找出最快的源并加载资源
>
> Find the fastest source from multiple CDNs and load resources

### 🏠 [主页](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import#readme)

[https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import#readme](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import#readme)


### ✨ [Demo](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import#readme)

[https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import#readme](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import#readme)


## 依赖要求


- node >=12

## 安装

```sh
npm install vite-plugin-fast-cdn-import
```

## 使用

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'
import { vitePluginFastCdnImport } from 'vite-plugin-fast-cdn-import'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        tsconfigPaths(),
        vitePluginFastCdnImport({ // 添加依赖即可
            cdnUrls: [ // 指定 CDN 源
                'https://npm.elemecdn.com/:name@:version/:path',
                'https://cdn.jsdelivr.net/npm/:name@:version/:path',
                'https://unpkg.com/:name@:version/:path',
            ],
            modules: [ // 目前仅支持 css 的加载
                {
                    name: 'normalize.css',
                    path: 'normalize.css',
                },
                {
                    name: 'element-plus',
                    path: 'dist/index.css',
                },
            ],
        }),
    ],
    server: {
        port: 4000,
        open: true,
        proxy: {},
    },
})


```

### 类型参考

```ts
export interface Module {
    name: string //包的名称
    version?: string //可选，以手动填写为准，默认会去 node_modules 下获取已安装的版本号
    path: string // 需要加载的资源路径
    cssOnly?: boolean // 是否为纯 css ，当前版本仅支持 css 的动态加载
}

export interface Options {
    /**
     * 要加载的包
     */
    modules: Module[]
    /**
     * CDN 的地址，格式：https://unpkg.com/:name@:version/:path
     */
    cdnUrls?: string[]
    /**
     * 禁用本插件注入js
     */
    disabled?: boolean
    /**
     * 全量竞速，即对每一个包都进行一次竞速
     */
    allRace?: boolean

    /**
     * 手动指定缓存key，改变cacheKey会使之前的缓存失效
     */
    cacheKey?: string
}
```

###  基本原理

在指定的多个 CDN 源中，会使用 `fetch`对第一个包的地址进行一次 `HEAD` 请求，得出最快的源，剩余的包不再竞速，直接采用该结果。

第一次的竞速结果会缓存在 `localStorage` 中，直到包的数量或版本号发生了改变，此时缓存失效，重复上述流程。

### 存在的问题

1. ~~由本项目的竞速原理可知，只会对第一个包进行竞速，因此可能会出现第一个包在某个 CDN 源是存在的，后续的包不存在，导致加载失败，故需要开发者手动对所有 CDN 源进行校验，确保所有的包都能在所有 CDN 源加载。~~ 可在配置中设置 `allRace`为 `true`启用全量竞速，会对每一个包都单独竞速。虽然可以解决包不存在的问题，但也多了竞速的耗时，请开发者自行权衡。
2. 由于用到了 `fetch`，所以在不支持 `fetch` 的浏览器下无法竞速，也就无法加载包。
3. 当缓存里的 CDN 源失效时，无法**自动**检测出失效的 CDN 源，此时会出现加载资源失败的情况。—— 该问题可通过**手动**修改 `cacheKey` 来解决。

## 开发

```sh
npm run dev
```

## 编译

```sh
npm run build
```

## Lint

```sh
npm run lint
```

## Commit

```sh
npm run commit
```


## 作者


👤 **CaoMeiYouRen**

* Website: [https://blog.cmyr.ltd/](https://blog.cmyr.ltd/)
* GitHub: [@CaoMeiYouRen](https://github.com/CaoMeiYouRen)


## 🤝贡献

欢迎 贡献、提问或提出新功能！<br />如有问题请查看 [issues page](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/issues). <br/>贡献或提出新功能可以查看[contributing guide](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/blob/master/CONTRIBUTING.md).

## 💰支持

如果觉得这个项目有用的话请给一颗⭐️，非常感谢

## 📝 License

Copyright © 2022 [CaoMeiYouRen](https://github.com/CaoMeiYouRen).<br />
This project is [MIT](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [cmyr-template-cli](https://github.com/CaoMeiYouRen/cmyr-template-cli)_
