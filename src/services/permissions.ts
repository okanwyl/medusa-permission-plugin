import {Lifetime} from "awilix"
import {
    buildQuery,
    EventBusService, ExtendedFindConfig, FindConfig, isString,
    Selector,
    TransactionBaseService,
    User,
} from "@medusajs/medusa"
import {EntityManager, FindManyOptions, FindOptionsWhere, ILike} from "typeorm";
import {PermissionsRepository} from "../repositories/permissions";
import {Permissions} from "../models/permissions";
import {IEventBusService} from "@medusajs/types";

type ListAndCountSelector = Selector<Permissions> & {
    q?: string
}


export default class PermissionsService extends TransactionBaseService {
    static LIFETIME = Lifetime.SINGLETON;
    protected readonly permissionsRepository_: typeof PermissionsRepository;
    protected readonly eventBusService_: IEventBusService;
    // protected readonly permissions;


    static readonly Events = {
        CREATED: "permission.created",
        UPDATED: "permission.updated",
        DELETED: "permission.deleted",
    }

    constructor(
        {eventBusService}: { eventBusService: IEventBusService },
        {permissionsRepository}: { permissionsRepository: typeof PermissionsRepository },
        options: Record<string, unknown>
    ) {
        // @ts-ignore
        super(...arguments);
        this.eventBusService_ = eventBusService;
        this.permissionsRepository_ = permissionsRepository;
    }

    async list(
        selector: Selector<Permissions> & {
            q?: string
        } = {},
        config = {skip: 0, take: 20}
    ): Promise<Permissions[]> {
        const [permissions] = await this.listAndCount(selector, config)
        return permissions
    }

    async listAndCount(
        selector: ListAndCountSelector = {},
        config: FindConfig<Permissions> = {skip: 0, take: 20}
    ): Promise<[Permissions[], number]> {
        const permissionsRepository = this.manager_.getRepository(
            Permissions
        )

        let q
        if (isString(selector.q)) {
            q = selector.q
            delete selector.q
        }

        const query = buildQuery(
            selector,
            config
        ) as FindManyOptions<Permissions> & {
            where: {}
        } & ExtendedFindConfig<Permissions>

        if (q) {
            const where = query.where as FindOptionsWhere<Permissions>

            delete where.role

            query.where = [
                {
                    ...where,
                    role: ILike(`%${q}%`),
                },
            ]
        }

        return await permissionsRepository.findAndCount(query)
    }

}
//
// return await this.atomicPhase_(async (manager) => {
//     const customerRepository = manager.withRepository(
//         this.customerRepository_
//     )
//
//     const customer = await this.retrieve(customerId)
//
//     const {
//         password,
//         metadata,
//         billing_address,
//         billing_address_id,
//         groups,
//         categories,
//         university_email,
//         ...rest
//     } = update
//
//     if (metadata) {
//         customer.metadata = setMetadata(customer, metadata)
//     }
//
//     // Start activation process if the customer updates, university email
//     if (university_email) {
//         if (customer.university_email !== university_email) {
//             customer.university_email = university_email
//             customer.is_account_activated = false
//             customer.validation_email_sent = false
//             await this.generateActivationToken(customer.id)
//         }
//     }
//
//     if ("billing_address_id" in update || "billing_address" in update) {
//         const address = billing_address_id || billing_address
//         if (isDefined(address)) {
//             await this.updateBillingAddress_(customer, address)
//         }
//     }
//
//     for (const [key, value] of Object.entries(rest)) {
//         customer[key] = value
//     }
//
//     if (password) {
//         customer.password_hash = await this.hashPassword_(password)
//     }
//
//     if (groups) {
//         customer.groups = groups as CustomerGroup[]
//     }
//
//     if (isDefined(categories)) {
//         customer.categories = []
//
//         if (categories?.length) {
//             const categoryIds = categories.map((c) => c.id)
//             customer.categories = categoryIds.map(
//                 (id) => ({ id }) as ProductCategory
//             )
//         }
//     }
//
//     const updated = await customerRepository.save(customer)
//
//     await this.eventBusService_
//         .withTransaction(manager)
//         .emit(CustomerService.Events.UPDATED, updated)
//
//     return updated
// })
