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
import { defaultAdminPolicyClusterRelations } from "./index"
import PolicyClusterService from "../../../../services/policy-cluster"
import { PolicyArrayInputReq } from "../../../../types/policy-cluster"
import { Type } from "class-transformer"
import { validator } from "@medusajs/medusa"

export default async (req: Request, res: Response) => {
  const validated = await validator(AdminPolicyClusterReq, req.body)

  console.log(validated)
  const policyClusterService: PolicyClusterService = req.scope.resolve(
    "policyClusterService"
  )

  const manager: EntityManager = req.scope.resolve("manager")

  const created = await manager.transaction(async (transactionManager) => {
    return await policyClusterService
      .withTransaction(transactionManager)
      .create(validated)
  })

  const policyCluster = await policyClusterService.retrieve(created.id, {
    relations: defaultAdminPolicyClusterRelations,
  })

  res.status(200).json({ policy_cluster: policyCluster })
}
// TODO: Correct validation requirement.
export class AdminPolicyClusterReq {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string

  @IsOptional()
  @Type(() => PolicyArrayInputReq)
  @ValidateNested({ each: true })
  @IsArray()
  policy?: PolicyArrayInputReq[]

  @IsArray()
  user: string[]
}
