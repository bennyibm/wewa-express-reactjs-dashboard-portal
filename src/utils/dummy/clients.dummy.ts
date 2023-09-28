import { faker } from '@faker-js/faker';
import { Client } from '../../models';

// export function generateClients(n: number){
    
//     return Array(n).fill(null).map( () : Client => {
//         const gender = faker.person.sex() as any
//         return {
//             _id: faker.date.anytime().valueOf().toString(),
//             first: faker.person.firstName(gender),
//             last: faker.person.lastName(gender),
//             // gender,
//             phone: faker.phone.number("+243 8# ### ####"),
//             contact: {},
//             address: {},
//             status: [ "CREATED", "CONFIRMED", "PENDING" ].at(faker.number.int({min: 0, max: 2})) as any
//         }
//     })
// }

const DUMMY_DRIVERS: never[] = [] // generateClients(20)

export default DUMMY_DRIVERS