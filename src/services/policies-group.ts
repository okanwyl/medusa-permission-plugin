import { Lifetime } from "awilix"
import {
  buildQuery,
  ExtendedFindConfig,
  FindConfig,
  isString,
  Selector,
  TransactionBaseService,
} from "@medusajs/medusa"
import { FindManyOptions, FindOptionsWhere, ILike } from "typeorm"
import { IEventBusService } from "@medusajs/types"
import { Policies } from "../models/policies"
import { isDefined, MedusaError } from "medusa-core-utils"
import { PoliciesGroup } from "src/models/policies-group"
import PoliciesGroupRepository from "../repositories/policies-group"
import {
  CreatePoliciesGroup,
  UpdatePoliciesGroup,
} from "../types/policies-group"

type ListAndCountSelector = Selector<PoliciesGroup> & {
  q?: string
}

export default class PoliciesGroupService extends TransactionBaseService {
  static LIFETIME = Lifetime.SINGLETON
  protected readonly policiesGroupRepository_: typeof PoliciesGroupRepository
  protected readonly eventBusService_: IEventBusService

  static readonly Events = {
    CREATED: "policy-group.created",
    UPDATED: "policy-group.updated",
    DELETED: "policy-group.deleted",
  }

  constructor(container) {
    // @ts-ignore
    super(...arguments)
    this.eventBusService_ = container.eventBusService
    this.policiesGroupRepository_ = container.policiesGroupRepository
  }

  async list(
    selector: Selector<PoliciesGroup> & {
      q?: string
    } = {},
    config = { skip: 0, take: 20 }
  ): Promise<PoliciesGroup[]> {
    const [policyGroup] = await this.listAndCount(selector, config)
    return policyGroup
  }

  async listAndCount(
    selector: ListAndCountSelector = {},
    config: FindConfig<PoliciesGroup> = { skip: 0, take: 20 }
  ): Promise<[PoliciesGroup[], number]> {
    const manager = this.activeManager_
    const policiesGroupRepository = manager.withRepository(
      this.policiesGroupRepository_
    )

    let q
    if (isString(selector.q)) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(
      selector,
      config
    ) as FindManyOptions<PoliciesGroup> & {
      where: {}
    } & ExtendedFindConfig<PoliciesGroup>

    if (q) {
      const where = query.where as FindOptionsWhere<PoliciesGroup>

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

    return await policiesGroupRepository.findAndCount(query)
  }

  async create(policyGroupDto: CreatePoliciesGroup): Promise<PoliciesGroup> {
    return await this.atomicPhase_(async (manager) => {
      const policiesGroupRepository = manager.withRepository(
        this.policiesGroupRepository_
      )

      const { policies: policies, ...rest } = policyGroupDto

      let policiesGroup = policiesGroupRepository.create(rest)

      if (isDefined(policies)) {
        policiesGroup.policies = []

        if (policies?.length) {
          const policyIds = policies.map((policy) => policy.id)
          policiesGroup.policies = policyIds.map((id) => ({ id }) as Policies)
        }
      }

      policiesGroup = await policiesGroupRepository.save(policiesGroup)

      const result = await this.retrieve(policiesGroup.id, {
        relations: ["policies"],
      })

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PoliciesGroupService.Events.CREATED, {
          id: result.id,
        })

      return result
    })
  }

  async retrieve(
    policyGroupId: string,
    config: FindConfig<PoliciesGroup> = {}
  ) {
    if (!isDefined(policyGroupId)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `"policyGroupId" must be defined`
      )
    }

    const policyGroupRepository = this.activeManager_.withRepository(
      this.policiesGroupRepository_
    )

    const query = buildQuery({ id: policyGroupId }, config)

    const policyGroup = await policyGroupRepository.findOne(query)

    if (!policyGroup) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Policy Group with id: ${policyGroupId} was not found`
      )
    }
    return policyGroup
  }

  async update(
    policyGroupId: string,
    update: UpdatePoliciesGroup
  ): Promise<PoliciesGroup> {
    return await this.atomicPhase_(async (manager) => {
      const policiesGroupRepository = manager.withRepository(
        this.policiesGroupRepository_
      )

      const policyGroup = await this.retrieve(policyGroupId)

      const { policies: policies, ...rest } = update

      const promises: Promise<any>[] = []

      if (isDefined(policies)) {
        policyGroup.policies = []

        if (policies?.length) {
          const policyIds = policies.map((c) => c.id)
          policyGroup.policies = policyIds.map((id) => ({ id }) as Policies)
        }
      }

      for (const [key, value] of Object.entries(rest)) {
        policyGroup[key] = value
      }

      const result = await policiesGroupRepository.save(policyGroup)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PoliciesGroupService.Events.UPDATED, {
          id: result.id,
        })

      return result
    })
  }

  async delete(policyGroupId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const policiesGroupRepository = manager.withRepository(
        this.policiesGroupRepository_
      )

      const policyGroup = await this.retrieve(policyGroupId)

      if (!policyGroup) {
        return Promise.resolve()
      }

      await policiesGroupRepository.softRemove(policyGroup)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PoliciesGroupService.Events.DELETED, {
          id: policyGroup.id,
        })

      return Promise.resolve()
    })
  }
}
