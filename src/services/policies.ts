import {Lifetime} from "awilix"
import {
    buildQuery,
    ExtendedFindConfig, FindConfig, isString,
    Selector,
    TransactionBaseService,
} from "@medusajs/medusa"
import {FindManyOptions, FindOptionsWhere, ILike} from "typeorm";
import {IEventBusService} from "@medusajs/types";
import PoliciesRepository from "../repositories/policies";
import {Policies} from "../models/policies";
import {CreatePolicy, UpdatePolicy} from "../types/policies";
import {isDefined, MedusaError} from "medusa-core-utils";

type ListAndCountSelector = Selector<Policies> & {
    q?: string
}


export default class PoliciesService extends TransactionBaseService {
    static LIFETIME = Lifetime.SINGLETON;
    protected readonly policiesRepository_: typeof PoliciesRepository;
    protected readonly eventBusService_: IEventBusService;


    static readonly Events = {
        CREATED: "policy.created",
        UPDATED: "policy.updated",
        DELETED: "policy.deleted",
    };

    constructor(
        container
    ) {
        // @ts-ignore
        super(...arguments);
        this.eventBusService_ = container.eventBusService;
        this.policiesRepository_ = container.policiesRepository;
    }

    async list(
        selector: Selector<Policies> & {
            q?: string
        } = {},
        config = {skip: 0, take: 20}
    ): Promise<Policies[]> {
        const [policies] = await this.listAndCount(selector, config)
        return policies
    }

    async listAndCount(
        selector: ListAndCountSelector = {},
        config: FindConfig<Policies> = {skip: 0, take: 20}
    ): Promise<[Policies[], number]> {
        const manager = this.activeManager_;
        const policiesRepository = manager.withRepository(
            this.policiesRepository_
        )

        let q
        if (isString(selector.q)) {
            q = selector.q
            delete selector.q
        }

        const query = buildQuery(
            selector,
            config
        ) as FindManyOptions<Policies> & {
            where: {}
        } & ExtendedFindConfig<Policies>

        if (q) {
            const where = query.where as FindOptionsWhere<Policies>

            delete where.name
            delete where.handle
            delete where.created_at
            delete where.updated_at

            query.where = [
                {
                    ...where,
                    name: ILike(`%${q}%`),
                },
                {
                    ...where,
                    handle: ILike(`%${q}%`),
                },
            ]
        }

        return await policiesRepository.findAndCount(query)
    }

    async create(policiesDto: CreatePolicy): Promise<Policies> {
        return await this.atomicPhase_(async (manager) => {
            const policiesRepository = manager.withRepository(
                this.policiesRepository_
            )


            let policy = policiesRepository.create(policiesDto)

            policy = await policiesRepository.save(policy)

            await this.eventBusService_
                .withTransaction(manager)
                .emit(PoliciesService.Events.CREATED, {
                    id: policy.id,
                })

            return policy
        })
    }

    async retrieve(policyId: string, config: FindConfig<Policies> = {}) {
        if (!isDefined(policyId)) {
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `"policyId" must be defined`
            )
        }

        const policiesRepository = this.activeManager_.withRepository(
            this.policiesRepository_
        )

        const query = buildQuery({id: policyId}, config)

        const policies = await policiesRepository.findOne(query)

        if (!policies) {
            throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `Policy with id: ${policyId} was not found`
            )
        }
        return policies
    }

    async update(
        policyId: string,
        update: UpdatePolicy
    ): Promise<Policies> {
        return await this.atomicPhase_(async (manager) => {
            const policiesRepository = manager.withRepository(
                this.policiesRepository_
            )


            let policy = await this.retrieve(policyId)

            const promises: Promise<any>[] = []


            for (const [key, value] of Object.entries(update)) {
                policy[key] = value
            }


            policy = await policiesRepository.save(policy)

            await this.eventBusService_
                .withTransaction(manager)
                .emit(PoliciesService.Events.UPDATED, {
                    id: policy.id,
                })

            return policy
        })
    }

    async delete(policyId: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
            const policiesRepository = manager.withRepository(
                this.policiesRepository_
            )

            const policy = await this.retrieve(policyId)

            if (!policy) {
                return Promise.resolve()
            }

            await policiesRepository.softRemove(policy)

            await this.eventBusService_
                .withTransaction(manager)
                .emit(PoliciesService.Events.DELETED, {
                    id: policy.id,
                })

            return Promise.resolve()
        })
    }

};
