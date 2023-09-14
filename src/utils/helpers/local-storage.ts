export function saveToLocalStorage(objName : string, obj : any){
    localStorage.setItem(objName, JSON.stringify(obj))
}

export function getFromLocalStorage<T = any>(attrName : string) {
    let obj = localStorage.getItem(attrName)
    return obj ? JSON.parse(obj) as any as T : undefined
}

export function deleteFromLocalStorage(attrName : string){
    localStorage.removeItem(attrName)
}

export function cleanLocalStorage(){
    localStorage.clear()
}