import Status from "../../models/common/status"

export function convertFileToB64(file : File) : FileReader{

    const fileReader = new FileReader()    
    fileReader.readAsDataURL(file)

    return fileReader
}

export function getStatus(index= 1){
    return [ "CREATED", "CONFIRMED", "PENDING" ][index] as Status
}