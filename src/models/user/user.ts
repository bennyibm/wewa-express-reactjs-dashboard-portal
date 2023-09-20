import AbstractEntity from "../common/abstract-entity"

export default class User extends AbstractEntity{
    first? : string
    last? : string
    email? : string
    username? : string
    phone? : string
    password?: string
    role? : string
}