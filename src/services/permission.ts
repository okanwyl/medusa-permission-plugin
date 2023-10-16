import {
    EventBusService,
    TransactionBaseService,
    User,
} from "@medusajs/medusa"
import {EntityManager} from "typeorm";

type InjectedDependencies = {
    manager: EntityManager
    eventBusService: EventBusService
}

class PermissionService extends TransactionBaseService {

    protected readonly loggedInUser_: User | null
    protected readonly eventBus_: EventBusService;
    protected readonly permissions;


    static readonly Events = {
        CREATED: "permission.created",
        UPDATED: "permission.updated",
        DELETED: "permission.deleted",
    }

    constructor({eventBusService}: InjectedDependencies) {
        super(arguments[0])
        this.eventBus_ = eventBusService;
    }
}

export default PermissionService