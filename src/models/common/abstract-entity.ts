import Metadata from './metadata';
import Status from './status';

export default abstract class AbstractEntity {
    _id? : string
    metadata? : Metadata
    description? : string
    status? : Status
}
