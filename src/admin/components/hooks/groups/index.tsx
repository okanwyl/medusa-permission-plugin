import {useAdminCustomPost, useAdminCustomQuery} from "medusa-react"
import {Policies, Policy} from "../policies"

export type PolicyGroup = {
  name: string
  handle: string
  description: string
  policies: Policies[]
  id: string
  created_at: string
  updated_at: string
}

export type AdminGroupPoliciesQuery = {
  expand?: string
  fields?: string
}

export type AdminGroupPoliciesRes = {
  policy_groups: PolicyGroup[]
  count: number
  offset: number
  limit: number
}

export type AdminGroupPolicyRes = {
  group_policy: PolicyGroup
}

export type AdminGroupPolicyReq = {
  name: string,
  description: string,
  policies: string[]
}



function useAdminGroupPolicies(queryObject: any) {
  const { data, isLoading, isRefetching } = useAdminCustomQuery<
    AdminGroupPoliciesQuery,
    AdminGroupPoliciesRes
  >(
    `/policy-groups`, // path
    ["admin-group-policies-list"], // queryKey
    queryObject
  )

  return {
    data,
    isLoading,
    isRefetching,
    count: data?.count,
  }
}

export function useAdminGroupPolicyId(id: string) {
  const { data, isLoading, isRefetching } = useAdminCustomQuery<
    AdminGroupPoliciesQuery,
    AdminGroupPolicyRes
  >(
    `/policy-groups/${id}`, // path
    ["single-policy-group", id] // queryKey
  )

  return {
    data,
    isLoading,
    isRefetching,
  }
}

export function mutateGroupAdminPolicy() {
  const { mutate, isLoading,isError, isSuccess, isIdle, isPaused} = useAdminCustomPost<
    AdminGroupPolicyReq,
    AdminGroupPolicyRes
  >(
    `/policy-groups`,
    ["group-policies-post"],
  )

  return {
    mutate,
    isLoading,
    isError,
    isSuccess,
    isIdle,
    isPaused
  }
}


export default useAdminGroupPolicies
