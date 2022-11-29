/* eslint-disable no-sync */
import path from 'path'
import fs from 'fs'
import { Plugin } from 'vite'
import { Options } from './types'

const DEFAULT_CDN_URLS = [
    'https://npm.elemecdn.com/:name@:version/:path',
    'https://cdn.jsdelivr.net/npm/:name@:version/:path',
    'https://unpkg.com/:name@:version/:path',
]
/**
 * get npm module version
 * @param name
 * @returns
 */
function getModuleVersion(name: string): string {
    const pwd = process.cwd()
    const pkgFile = path.join(pwd, 'node_modules', name, 'package.json')
    if (fs.existsSync(pkgFile)) {
        const pkgJson = JSON.parse(fs.readFileSync(pkgFile, 'utf8'))
        return pkgJson.version
    }
    return ''
}

export function vitePluginFastCdnImport(options: Options): Plugin {
    const { modules = [], cdnUrls = DEFAULT_CDN_URLS, disabled = false, allRace = false, cacheKey, disabledCache = false } = options
    return {
        name: 'vite-plugin-fast-cdn-import',
        enforce: 'post',
        transformIndexHtml(html) {
            if (disabled) {
                return html
            }
            const injectJs = fs.readFileSync(path.join(__dirname, './client.js'), 'utf-8')
            const cdnModules = modules.map((m) => ({
                ...m,
                version: m.version || getModuleVersion(m.name), // 获取版本号
            }))
            const code = `\n<script type="module">${injectJs.replace('window.__FAST_CDN_URLS__', JSON.stringify(cdnUrls))
                .replace('window.__FAST_CDN_MODULES__', JSON.stringify(cdnModules))
                .replace('window.__FAST_CDN_ALL_RACE__', JSON.stringify(allRace))
                .replace('window.__FAST_CDN_CACHE_KEY__', JSON.stringify(cacheKey))
                .replace('window.__FAST_CDN_DISABLED_CACHE__', JSON.stringify(disabledCache))}
                </script>`
            return html.replace(
                /<\/title>/i,
                `</title>${code}`,
            )
        },
    }
}

export default vitePluginFastCdnImport
