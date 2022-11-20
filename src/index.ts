import path from 'path'
import fsp from 'fs/promises'
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
async function getModuleVersion(name: string): Promise<string> {
    const pwd = process.cwd()
    const pkgFile = path.join(pwd, 'node_modules', name, 'package.json')
    // eslint-disable-next-line no-sync
    if (fs.existsSync(pkgFile)) {
        const pkgJson = JSON.parse(await fsp.readFile(pkgFile, 'utf8'))
        console.log(name, pkgJson.version)
        return pkgJson.version
    }

    return ''
}

export async function vitePluginFastCdnImport(options: Options): Promise<Plugin> {
    const { modules = [], cdnUrls = DEFAULT_CDN_URLS, disabled = false } = options
    const injectJs = await fsp.readFile(path.join(__dirname, './client.js'), 'utf-8')
    // 从 CDN 导入
    // 目前只支持 css
    const cssModule = await Promise.all(modules.filter((m) => m.cssOnly ?? true)
        .map(async (m) => ({
            ...m,
            version: m.version || await getModuleVersion(m.name),
        })))
    return {
        name: 'vite-plugin-fast-cdn-import',
        enforce: 'post', // 前置调用
        // apply: 'build', // 仅生产环境调用
        transformIndexHtml(html) {
            if (disabled) {
                return html
            }
            const code = `<script type="module">${injectJs.replace('window.__FAST_CDN_URLS__', JSON.stringify(cdnUrls)).replace('window.__FAST_CDN_MODULES__', JSON.stringify(cssModule))}</script>`
            return html.replace(
                /<\/title>/i,
                `\n</title>${code}`,
            )
        },
    }
}

export default vitePluginFastCdnImport
