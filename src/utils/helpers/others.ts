export function convertFileToB64(file : File) : FileReader{

    const fileReader = new FileReader()    
    fileReader.readAsDataURL(file)

    return fileReader
}