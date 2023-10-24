import {Lifetime} from "awilix"
import {
    TransactionBaseService,
} from "@medusajs/medusa"
import {IEventBusService} from "@medusajs/types"
import {Policy} from "../models/policy"
import PolicyRepository from "../repositories/policy";
import PolicyClusterRepository from "../repositories/policy-cluster";

export default class PermissionsService extends TransactionBaseService {

    static LIFETIME = Lifetime.SINGLETON
    protected readonly policyClusterRepository_: typeof PolicyClusterRepository
    protected readonly eventBusService_: IEventBusService
    private _policiesHashmap: Map<string, Policy[]>;
    private _initialized: boolean = false;

    static readonly Events = {
        CREATED: "permissions.service.updated",
    }

    constructor(container) {
        // @ts-ignore
        super(...arguments)
        this.eventBusService_ = container.eventBusService
        this.policyClusterRepository_ = container.policyClusterRepository
        this._policiesHashmap = new Map<string, Policy[]>();

    }

    async init(): Promise<void> {
        if (this._initialized) return;  // If already initialized, return immediately

        try {
            await this.createPolicyHashmap();
            this._initialized = true;  // Set the flag after successful initialization
        } catch (err) {
            console.error(`Cluster Hashmap creation error: ${err}`);
        }
    }

    get policiesHashmap(): Map<string, Policy[]> {
        return this._policiesHashmap;
    }

    async createPolicyHashmap(): Promise<void> {
        const clusterIdMap = new Map<string, Policy[]>();

        const policyClusterRepository = this.activeManager_.withRepository(
            this.policyClusterRepository_
        )

        const clusters = await policyClusterRepository.find({relations: ["policy"]});

        clusters.forEach(cluster => {
            clusterIdMap.set(cluster.id, cluster.policy);
        });

        this._policiesHashmap = clusterIdMap;
    }

}
