export function renderUrl(url: string, info: { name: string, version: string, path: string }) {
    const { name, version, path } = info
    return url.replace(':name', name).replace(':version', version).replace(':path', path)
}
