import AbstractEntity from "./common/abstract-entity";
import User from './user/user';

type Driver = AbstractEntity & User & {
    gender: string
}

export default Driver