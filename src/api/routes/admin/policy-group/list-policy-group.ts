import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { Request, Response } from "express"

import { Type } from "class-transformer"
import { DateComparisonOperator } from "@medusajs/medusa"
import PoliciesGroupService from "../../../../services/policies-group"

export default async (req: Request, res: Response) => {
  const policiesGroupService: PoliciesGroupService = req.scope.resolve(
    "policiesGroupService"
  )

  const { filterableFields, listConfig } = req
  const { skip, take } = listConfig

  const [policyGroups, count] = await policiesGroupService.listAndCount(
    filterableFields,
    listConfig
  )

  res.status(200).json({
    policy_groups: policyGroups,
    count,
    offset: skip,
    limit: take,
  })
}

export class AdminGetUniversityPaginationParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 10

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0
}

// eslint-disable-next-line max-len
export class AdminGetUniversityParams extends AdminGetUniversityPaginationParams {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  handle?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator

  @IsString()
  @IsOptional()
  q?: string
}
