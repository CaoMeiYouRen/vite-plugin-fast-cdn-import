export interface Module {
    name: string
    version?: string
    // var?: string
    path: string // | string[]
    cssOnly?: true
}

export interface Options {
    modules: Module[]
    cdnUrls?: string[]
    disabled?: boolean
}

