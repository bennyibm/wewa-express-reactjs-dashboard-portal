export interface StatisticsCompleteFieldDetailsStat{
    month : number | string,
    count : number
}
export interface StatisticsCompleteFieldDetails{
    count : number,
    year : number
    stats : StatisticsCompleteFieldDetailsStat[]
}

export interface StatisticsCompleteField{
    count : number,
    details : StatisticsCompleteFieldDetails[]
}


interface StatisticsComplete{
    readers : StatisticsCompleteFieldDetails
    books : StatisticsCompleteFieldDetails
    authors : StatisticsCompleteFieldDetails
}


export default StatisticsComplete
