import Status from "../../models/common/status";

export default function getStatusClass(status?: Status){

    let resClasses = "text-white text-xs p-2 rounded-lg w-fit "
    if(!status){
        return ""
    }

    switch (status) {
        case Status.ACTIVE:
        case Status.CONFIRMED:
            resClasses +="bg-green-600"
            break
        case Status.BLOCKED:
        case Status.CANCELLED:
            resClasses +="bg-red-600";
            break
        default:
            resClasses +="bg-yellow-600";
    }

    return resClasses
}