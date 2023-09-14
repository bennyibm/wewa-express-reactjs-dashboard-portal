export function transformToFormData(obj :any){
    let formData = new FormData()
    Object.entries(obj).forEach( field => formData.set(field[0], (field[1] || '') as any))

    return formData
}