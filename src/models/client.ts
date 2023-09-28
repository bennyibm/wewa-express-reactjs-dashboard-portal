
import AbstractEntity from "./common/abstract-entity";
import Contact from "./common/contact";
import User from "./user/user";
import Address from './common/address';

type Client =  AbstractEntity & {
    user: User
    contact: Contact
    address: Address
}

export default Client