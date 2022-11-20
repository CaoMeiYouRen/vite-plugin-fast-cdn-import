export interface Module {
    /**
     * 包的名称
     *
     * @author CaoMeiYouRen
     * @date 2022-11-20
     */
    name: string
    /**
     * 以手动填写为准，默认会去 node_modules 下获取已安装的版本号
     *
     * @author CaoMeiYouRen
     * @date 2022-11-20
     */
    version?: string
    // var?: string
    // 需要加载的资源路径，相对于包的地址
    path: string
    /**
     * 是否为纯 css
     *
     * @author CaoMeiYouRen
     * @date 2022-11-20
     */
    cssOnly?: boolean
}

export interface Options {
    /**
     * 要加载的包
     *
     * @author CaoMeiYouRen
     * @date 2022-11-20
     */
    modules: Module[]
    /**
     * CDN 的地址，格式：https://unpkg.com/:name@:version/:path
     *
     * @author CaoMeiYouRen
     * @date 2022-11-20
     */
    cdnUrls?: string[]
    /**
     * 禁用本插件注入js
     *
     * @author CaoMeiYouRen
     * @date 2022-11-20
     */
    disabled?: boolean
    /**
     * 全量竞速，即对每一个包都进行一次竞速
     *
     * @author CaoMeiYouRen
     * @date 2022-11-20
     */
    allRace?: boolean

    /**
     * 手动指定缓存key，改变cacheKey会使之前的缓存失效
     *
     * @author CaoMeiYouRen
     * @date 2022-11-20
     */
    cacheKey?: string
}

export interface FastUrl {
    cssOnly: boolean
    url: string
}