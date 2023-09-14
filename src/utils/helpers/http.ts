
export function normalizeUrl(url : string) : string {
    if(url.startsWith("/")){
        url = url.substring(1)
    }

    if(url.endsWith("/")){
        url = url.substring(0, url.length-1)
    }

    return url
}

export function conactUrl(base : string, path : string) : string {
    base = normalizeUrl(base)
    path = normalizeUrl(path)
    
    return `${base}/${path}`
}