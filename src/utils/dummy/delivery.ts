import { faker } from '@faker-js/faker';
import { Delivery } from '../../models';

export function generateDeliveries(n: number){
    return Array(n).fill(null).map( () : Delivery => {
        const gender = faker.person.sex() as any
        const phone = faker.phone.number("+243 8# ## ### ##")
        const first = faker.person.firstName(gender)
        const last = faker.person.lastName(gender)
        return {
            _id: faker.date.anytime().valueOf().toString(),
            code: faker.internet.password({ prefix: "DELIVERY-"}),
            client: {
                phone,
                first,
                last,
                contact: { phone, email: faker.internet.email({firstName: first, lastName: last})  },
                address: {}
            },
            driver: { first: faker.person.firstName(), last: faker.person.lastName(), gender: faker.person.sex() },
            package: { 
                description: faker.commerce.productDescription(), 
                beneficiary: { 
                    name: `${faker.person.firstName()} ${faker.person.middleName()} ${faker.person.lastName()}`,
                    address: {},
                    contact: { phone: faker.phone.number("+243 97 ## ### ##"), email: faker.internet.email()},
                },

            },
            status: [ "CREATED", "DELIVERED", "ON_THE_WAY", "ABORTED", "PENDING" ].at(faker.number.int({min: 0, max: 5})) as any
        }
    })
}

const DUMMY_DELIVERIES = generateDeliveries(20)

export default DUMMY_DELIVERIES