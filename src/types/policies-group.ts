import { IsString } from "class-validator"

export declare type CreatePoliciesGroup = {
  name: string
  handle?: string
  description?: string
  policies?: CreatePolicyGroupPolicyInput[] | null
}

export type CreatePolicyGroupPolicyInput = {
  id: string
}

export class PoliciesGroupPolicyReq {
  @IsString()
  id: string
}

export type UpdatePoliciesGroup = Partial<CreatePoliciesGroup>
