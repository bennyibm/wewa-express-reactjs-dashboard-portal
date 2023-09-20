import AbstractEntity from "./common/abstract-entity";
import User from './user/user';

type Driver = AbstractEntity & {
    user: User
    gender: string
}

export default Driver