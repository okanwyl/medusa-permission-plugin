import {Lifetime} from "awilix"
import {
    TransactionBaseService,
} from "@medusajs/medusa"
import {IEventBusService} from "@medusajs/types"
import {Policy} from "../models/policy"
import PolicyRepository from "../repositories/policy";

export default class PermissionsService extends TransactionBaseService {

    static LIFETIME = Lifetime.SINGLETON
    protected readonly policyRepository_: typeof PolicyRepository
    protected readonly eventBusService_: IEventBusService
    private readonly _policiesHashmap: Map<string, Policy[]>;

    static readonly Events = {
        CREATED: "permissions.service.updated",
    }

    constructor(container) {
        // @ts-ignore
        super(...arguments)
        this.eventBusService_ = container.eventBusService
        this.policyRepository_ = container.policyRepository
        this._policiesHashmap = new Map();
    }


    async fetchPolicies() {
        const policiesRepository = this.activeManager_.withRepository(
            this.policyRepository_
        )

        const policies = await policiesRepository.find({});

        return policies;

    }
    get policiesHashmap(): Map<string, Policy[]> {
        return this._policiesHashmap;
    }

}
