import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react"

export type Policies = {
  name: string
  handle: string
  description: string
  method: string
  base_router: string
  custom_regex: string
  id: string
  created_at: string
  updated_at: string
}

export type AdminPolicyQuery = {
  expand?: string
  fields?: string
}

export type AdminPoliciesRes = {
  policies: Policies[]
  count: number
  offset: number
  limit: number
}

export type AdminPolicyRes = {
  policy: Policy
}

export type AdminPolicyReq = {
  name: string
  description: string
  method: string
  base_router: string
  custom_regex: string
}

export type Policy = Policies
type AdminPolicyQueryType = AdminPolicyQuery
type AdminPoliciesResType = AdminPoliciesRes

function useAdminPolicies(queryObject: any) {
  const { data, isLoading, isRefetching } = useAdminCustomQuery<
    AdminPolicyQueryType,
    AdminPoliciesResType
  >(
    `/policies`, // path
    ["admin-policies-list"], // queryKey
    queryObject
  )

  return {
    data,
    isLoading,
    isRefetching,
    count: data?.count,
  }
}

export function useAdminPolicyId(id: string) {
  const { data, isLoading, isRefetching } = useAdminCustomQuery<
    AdminPolicyQuery,
    AdminPolicyRes
  >(
    `/policies/${id}`, // path
    ["single-policy", id] // queryKey
  )

  return {
    data,
    isLoading,
    isRefetching,
  }
}

export function mutateAdminPolicy() {
  const { mutate, isLoading } = useAdminCustomPost<
    AdminPolicyReq,
    AdminPolicyRes
  >(`/policies`, ["policies-r"])

  return {
    mutate,
    isLoading,
  }
}

export default useAdminPolicies
