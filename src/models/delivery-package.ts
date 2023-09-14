import Status from "./common/status"
import Address from './common/address';
import Contact from "./common/contact";

export interface PackageItem{
    code: string
    description: string
    status: Status
    beneficiary: Beneficiary
    note?: string
}

export interface Beneficiary{
    name: string
    address: Address
    contact: Contact
}
export default interface DeliveryPackage{
    code: string
    status: Status
}