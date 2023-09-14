export default interface ResponseModel<T>{
    totalElements: number
    totalPages: number
    contents: T[]
    currentPage : number    
}