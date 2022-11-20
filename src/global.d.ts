interface Module {
    name: string
    version?: string
    // var?: string
    path: string // | string[]
    cssOnly?: true
}

declare interface Window {
    __FAST_CDN_URLS__?: string[]
    __FAST_CDN_MODULES__?: Module[]
    __FAST_CDN_CACHE_KEY__?: string
    __FAST_CDN_ALL_RACE__?: boolean
}
