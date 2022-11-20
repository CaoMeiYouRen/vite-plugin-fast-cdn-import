import { Module } from './types'

/**
 * 获取所有包最快的源，获取失败的包返回空字符串
 *
 * @author CaoMeiYouRen
 * @date 2022-11-19
 * @export
 * @param cdnUrls
 * @param modules
 */
async function getFastCdns(cdnUrls: string[], modules: Module[]) {
    const fastUrls: string[] = []
    const pkgs = [...modules]
    let fastUrl = ''
    do {
        const first = pkgs.shift()
        if (!first) { // 如果没有成员了就跳出
            break
        }
        const fast = await getFastCdn(cdnUrls, first)
        fastUrls.push(fast) // 无论是否是空字符串都 push
        if (fast) { // 如果成功获取到 最快源 了，就跳出
            fastUrl = fast
            break
        }
    } while (pkgs.length > 0)
    if (fastUrl) {  // 找出 最快的源是谁
        const fastCdn = cdnUrls.find((cdnUrl) => new URL(cdnUrl).host === new URL(fastUrl).host,
        )
        if (fastCdn) {
            fastUrls.push(...pkgs.map((module) => {
                const { name, version, path } = module
                return fastCdn.replace(':name', name).replace(':version', version).replace(':path', path)
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
async function getFastCdn(cdnUrls: string[], module: Module) {
    try {
        const { name, version, path } = module
        const urls = cdnUrls.map((cdnUrl) => cdnUrl.replace(':name', name).replace(':version', version).replace(':path', path))
        const fast = await getFastUrl(urls)
        if (!fast) {
            console.error(`包 ${name} 未能获取到最快 CDN`)
            return ''
        }
        return fast
    } catch (error) {
        console.error(error)
        return ''
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
    return Promise.any(urls.map((url) => Promise.race([
        fetch(url, {
            method: 'HEAD',
            headers: {},
            body: null,
        }).then((resp) => resp.url),
        new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Ajax timeout!'))
            }, 15 * 1000)
        }),
    ])))
}

function includeLinkStyle(url: string) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = url
    document?.getElementsByTagName('head')[0]?.appendChild(link)
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
    const cacheKey = window.__FAST_CDN_CACHE_KEY__ || modules.map((e) => `${e.name}@${e.version}`).join(',')
    const urls = getLocalStorage<string[]>(cacheKey) || (await getFastCdns(
        cdnUrls,
        modules,
    ).then((res) => {
        setLocalStorage(cacheKey, res)
        return res
    }))?.filter(Boolean)

    urls?.forEach((url) => {
        includeLinkStyle(url)
    })
}

init()
