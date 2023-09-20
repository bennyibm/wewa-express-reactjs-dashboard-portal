import { faker } from '@faker-js/faker';
import { Driver } from '../../models';
import Status from '../../models/common/status';

export function generateDrivers(n: number){
    
    return Array(n).fill(null).map( () : Driver => {
        const gender = faker.person.sex() as any
        return {
            _id: faker.date.anytime().valueOf().toString(),
            user: {                
                _id: faker.date.anytime().valueOf().toString(),
                first: faker.person.firstName(gender),
                last: faker.person.lastName(gender),
                phone: faker.phone.number("+243 8# ### ####"),
                status: Status.CONFIRMED
            },
            gender,
            status: [ "CREATED", "CONFIRMED", "PENDING" ].at(faker.number.int({min: 0, max: 2})) as any
        }
    })
}

const DUMMY_DRIVERS = generateDrivers(20)

export default DUMMY_DRIVERS