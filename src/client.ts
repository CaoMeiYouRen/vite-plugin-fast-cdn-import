import { FastUrl, Module } from './types'
import { renderUrl } from './utils'
/**
 * 获取所有包最快的源，获取失败的包返回空字符串
 *
 * @author CaoMeiYouRen
 * @date 2022-11-19
 * @export
 * @param cdnUrls
 * @param modules
 */
async function getFastCdns(cdnUrls: string[], modules: Module[], allRace: boolean = false) {
    const fastUrls: FastUrl[] = []
    const pkgs = [...modules]
    let fastUrl: FastUrl | null = null
    do {
        const first = pkgs.shift()
        if (!first) { // 如果没有成员了就跳出
            break
        }
        const fast = await getFastCdn(cdnUrls, first)
        fastUrls.push(fast) // 无论是否是 null 都 push
        if (!allRace && fast) { // 如果不是全量竞速，且成功获取到 最快源 了，就跳出
            fastUrl = fast
            break
        }
    } while (pkgs.length > 0)
    if (fastUrl) {  // 找出 最快的源是谁
        const fastCdn = cdnUrls.find((cdnUrl) => new URL(cdnUrl).host === new URL(fastUrl.url).host)
        if (fastCdn) {
            fastUrls.push(...pkgs.map((module) => {
                const { name, version, path, cssOnly, esModule } = module
                return {
                    cssOnly,
                    esModule,
                    url: renderUrl(fastCdn, { name, version, path }),
                }
            }))
        }
    }
    return fastUrls
}

/**
 * 获取单个包最快的源
 *
 * @author CaoMeiYouRen
 * @date 2022-11-19
 * @param cdnUrls
 * @param module
 */
async function getFastCdn(cdnUrls: string[], module: Module): Promise<FastUrl | null> {
    try {
        const { name, version, path, cssOnly, esModule } = module
        const urls = cdnUrls.map((cdnUrl) => renderUrl(cdnUrl, { name, version, path }))
        if (!urls.length) { // 如果没有配置 cdn，跳过竞速
            console.error(`包 ${name} 未能获取到最快 CDN`)
            return null
        }
        if (urls.length === 1) {  // 如果只有一个 cdn，跳过竞速
            return {
                cssOnly,
                esModule,
                url: urls[0],
            }
        }
        const fast = await getFastUrl(urls)
        if (!fast) {
            console.error(`包 ${name} 未能获取到最快 CDN`)
            return null
        }
        return {
            cssOnly,
            esModule,
            url: fast,
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

/**
 * 获取响应速度最快的 URL
 *
 * @author CaoMeiYouRen
 * @date 2022-11-10
 * @param urls
 */
async function getFastUrl(urls: string[]) {
    const controller = new AbortController()
    const signal = controller.signal
    return Promise.any(urls.map(async (url) => {
        const resp = await ajaxHead({
            url, signal,
        })
        controller.abort()
        return resp
    }))
}

type AjaxConfig = {
    url: string
    signal?: AbortSignal
}

async function ajaxHead(config: AjaxConfig) {
    const { url, signal } = config
    return Promise.race(
        [
            fetch(url, {
                method: 'HEAD',
                signal,
            })
                .then((resp) => resp.url)
                .catch((error: DOMException) => {
                    if (error?.message?.includes('aborted')) {
                        return
                    }
                    throw error
                }),
            new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('Ajax timeout!'))
                }, 10 * 1000)
            }),
        ],
    )
}

function includeLinkStyle(url: string) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = url
    document.getElementsByTagName('head')?.[0]?.appendChild(link)
    return link
}

function includeJavaScript(url: string, esModule?: boolean) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    if (esModule) {
        script.type = 'module'
    }
    document.getElementsByTagName('head')?.[0]?.appendChild(script)
    // const s = document.getElementsByTagName('script')[0]
    // s.parentNode.insertBefore(script, s)
    return script
}

function setLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
}

function getLocalStorage<T = any>(key: string): (T | null) {
    try {
        return JSON.parse(localStorage.getItem(key))
    } catch (error) {
        return null
    }
}

async function init() {
    const cdnUrls = window.__FAST_CDN_URLS__ || []
    const modules = window.__FAST_CDN_MODULES__ || []
    const allRace = window.__FAST_CDN_ALL_RACE__ ?? false
    const disabledCache = window.__FAST_CDN_DISABLED_CACHE__ ?? false
    const cacheKey = window.__FAST_CDN_CACHE_KEY__ || `${cdnUrls.join(',')}__${modules.map((e) => `${e.name}@${e.version}`).join(',')}`

    let fastUrls = getLocalStorage<FastUrl[]>(cacheKey)
    if (disabledCache || !fastUrls?.length) { // 如果 禁用缓存 或 没有缓存 就竞速
        fastUrls = (await getFastCdns(
            cdnUrls,
            modules,
            allRace,
        ))?.filter(Boolean)
        setLocalStorage(cacheKey, fastUrls)
    }
    fastUrls.forEach((m) => { // 加载
        if (m.cssOnly) {
            includeLinkStyle(m.url)
        } else {
            // includeJavaScript(m.url, m.esModule)
        }
    })
}

init()
