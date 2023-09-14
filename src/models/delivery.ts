
import AbstractEntity from "./common/abstract-entity";
import Contact from "./common/contact";
import Status from "./common/status";
import Address from './common/address';
import Client from "./client";
import Driver from "./driver";


export interface Package{
    code?: string
    description: string
    status?: Status
    beneficiary: Beneficiary
}

export interface Beneficiary{
    name: string
    address: Address
    contact: Contact
}

export default interface Delivery extends AbstractEntity{
    code : string
    client: Client
    driver?: Driver
    package: Package
}