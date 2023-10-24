import {useAdminCustomQuery, useAdminCustomPost} from "medusa-react"

export type Policy = {
    name: string
    description: string
    method: string
    base_router: string
    id: string
    created_at: string
    updated_at: string
}

export type AdminPolicyQuery = {
    expand?: string
    fields?: string
}

export type AdminListPolicyRes = {
    policy: Policy[]
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
}

type AdminPolicyQueryType = AdminPolicyQuery
type AdminPolicyResType = AdminListPolicyRes

export function useAdminPolicy(queryObject: any) {
    const {data, isLoading, isRefetching, isError, isFetched, isSuccess} = useAdminCustomQuery<
        AdminPolicyQueryType,
        AdminPolicyResType
    >(
        `/policy`,
        ["admin-policy-list"],
        queryObject
    )

    return {
        policy: data?.policy ?? [],
        isLoading,
        isRefetching,
        isError,
        isSuccess,
        count: data?.count,
    }
}

export function mutateAdminPolicy() {
    const {mutate, isLoading} = useAdminCustomPost<
        AdminPolicyReq,
        AdminPolicyRes
    >(`/policy`, ["admin-policy-post"])

    return {
        mutate,
        isLoading,
    }
}

