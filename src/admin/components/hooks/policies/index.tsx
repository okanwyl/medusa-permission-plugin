import {useAdminCustomQuery} from "medusa-react"

type Policies = {
    name: string,
    handle: string,
    description: string,
    method: string,
    base_router: string,
    id: string,
    created_at: string;
    updated_at: string;
}

export type AdminPolicyQuery = {
    expand?: string,
    fields?: string
}

export type AdminPoliciesRes = {
    policies: Policies[];
    count: number;
    offset: number;
    limit: number;
};


type AdminPolicyQueryType = AdminPolicyQuery;
type AdminPoliciesResType = AdminPoliciesRes;

function useAdminPolicies(queryObject: any) {
    const {data, isLoading, isRefetching} = useAdminCustomQuery<AdminPolicyQueryType, AdminPoliciesResType>(
        `/policies`,  // path
        ["admin-policies-list"], // queryKey
        queryObject
    );

    return {
        data,
        isLoading,
        isRefetching,
        count: data?.count
    };
}

export default useAdminPolicies;
