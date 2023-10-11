import { Lifetime } from "awilix"
import {
    TransactionBaseService,
    User,
} from "@medusajs/medusa"

class HelloService extends TransactionBaseService {

    protected readonly loggedInUser_: User | null

    constructor(container, options) {
        // @ts-ignore
        super(...arguments)

        try {
            this.loggedInUser_ = container.loggedInUser
            console.log(this.loggedInUser_);
        } catch (e) {
            // avoid errors when backend first runs
        }
    }

    // ...
}

export default HelloService