# vite-plugin-fast-cdn-import

# [1.3.0](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/compare/v1.2.1...v1.3.0) (2025-02-11)


### ✨ 新功能

* 添加 importmap 支持并重构 renderUrl 函数；优化插件配置选项 ([1b09298](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/commit/1b09298))

## [1.2.1](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/compare/v1.2.0...v1.2.1) (2022-11-30)


### 🐛 Bug 修复

* 优化 对没有配置 cdn、仅配置 1 个 cdn 情况的载入；修复 排除的依赖不全局加载的问题；更新文档 ([6bbf75e](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/commit/6bbf75e))

# [1.2.0](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/compare/v1.1.3...v1.2.0) (2022-11-29)


### ♻ 代码重构

* 优化代码结构 ([2c5ea75](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/commit/2c5ea75))


### ✨ 新功能

* 增加了 js 脚本支持；优化了缓存 key；优化了加载模式 ([2ca939e](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/commit/2ca939e))

## [1.1.3](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/compare/v1.1.2...v1.1.3) (2022-11-25)


### 🐛 Bug 修复

* 新增 keywords；修改 最低 node 版本为 14 ([eeb0b0b](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/commit/eeb0b0b))

## [1.1.2](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/compare/v1.1.1...v1.1.2) (2022-11-23)


### 🐛 Bug 修复

* 修改 不为 aborted 的 error 改为向上抛出异常 ([0ccd886](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/commit/0ccd886))

## [1.1.1](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/compare/v1.1.0...v1.1.1) (2022-11-22)


### 🐛 Bug 修复

* 优化竞速后对请求的中断 ([02c9776](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/commit/02c9776))
* 新增 禁用缓存 配置；优化 部分代码逻辑 ([8fdd7bb](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/commit/8fdd7bb))

# [1.1.0](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/compare/v1.0.2...v1.1.0) (2022-11-20)


### ✨ 新功能

* 新增 全量竞速功能 ([f60d4af](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/commit/f60d4af))

## [1.0.2](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/compare/v1.0.1...v1.0.2) (2022-11-20)


### 🐛 Bug 修复

* 修复 cssModule 类型问题 ([14c61dd](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/commit/14c61dd))
* 移除 不必要的 console.log ([5f2ff69](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/commit/5f2ff69))

## [1.0.1](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/compare/v1.0.0...v1.0.1) (2022-11-20)


### 🐛 Bug 修复

* 修改 vitePluginFastCdnImport 为 同步函数，兼容 vite2 ([32755c9](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/commit/32755c9))

# 1.0.0 (2022-11-20)


### ✨ 新功能

* 完成基本功能的开发 ([8176ef1](https://github.com/CaoMeiYouRen/vite-plugin-fast-cdn-import/commit/8176ef1))
