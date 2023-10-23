import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { defaultAdminPolicyGroupRelations } from "./index"
import PoliciesGroupService from "../../../../services/policies-group"
import { PoliciesGroupPolicyReq } from "../../../../types/policies-group"
import { Type } from "class-transformer"
import { validator } from "@medusajs/medusa"

export default async (req: Request, res: Response) => {
  const validated = await validator(AdminPoliciesGroupReq, req.body)

  console.log(validated)
  const policiesGroupService: PoliciesGroupService = req.scope.resolve(
    "policiesGroupService"
  )

  const manager: EntityManager = req.scope.resolve("manager")

  const created = await manager.transaction(async (transactionManager) => {
    return await policiesGroupService
      .withTransaction(transactionManager)
      .create(validated)
  })

  const policiesGroup = await policiesGroupService.retrieve(created.id, {
    relations: defaultAdminPolicyGroupRelations,
  })

  res.status(200).json({ group_policy: policiesGroup })
}

export class AdminPoliciesGroupReq {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsOptional()
  @Type(() => PoliciesGroupPolicyReq)
  @ValidateNested({ each: true })
  @IsArray()
  policies?: PoliciesGroupPolicyReq[]
}
