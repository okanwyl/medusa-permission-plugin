import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react"
import { Policies } from "../policies";

export type PolicyGroup = {
  name: string,
  handle: string,
  description: string,
  policies: Policies[],
  id: string,
  created_at: string;
  updated_at: string;
}

export type AdminGroupPoliciesQuery = {
  expand?: string,
  fields?: string
}

export type AdminGroupPoliciesRes = {
  policy_groups: PolicyGroup[];
  count: number;
  offset: number;
  limit: number;
};

export type AdminGroupPolicyRes = {
  group_policy: PolicyGroup
}

// export type AdminPolicyReq = {
//   name: string,
//   description: string,
//   method: string,
//   base_router: string,
//   custom_regex: string
// }
//
//{"policy_groups":[{"id":"policy_group_01HCYTCPQ84XC4DZNVBSE317SS","created_at":"2023-10-17T09:39:54.338Z","updated_at":"2023-10-17T09:39:54.338Z","deleted_at":null,"name":"mytest here6","handle":"mytest-here-6","description":"Test","policies":[]},{"id":"policy_group_01HCYKJWZFSHRN83XXX0VBA5MV","created_at":"2023-10-17T07:40:57.325Z","updated_at":"2023-10-17T07:40:57.325Z","deleted_at":null,"name":"mytest here4","handle":"mytest-here-4","description":null,"policies":[]}],"count":2,"offset":0,"limit":10}


function useAdminGroupPolicies(queryObject: any) {
  const { data, isLoading, isRefetching } = useAdminCustomQuery<AdminGroupPoliciesQuery, AdminGroupPoliciesRes>(
    `/policy-groups`,  // path
    ["admin-group-policies-list"], // queryKey
    queryObject
  );

  return {
    data,
    isLoading,
    isRefetching,
    count: data?.count
  };
}


export function useAdminGroupPolicyId(id: string) {
  const { data, isLoading, isRefetching } = useAdminCustomQuery<
    AdminGroupPoliciesQuery,
    AdminGroupPolicyRes
  >(
    `/policy-groups/${id}`,  // path
    ["single-policy-group", id] // queryKey
  )


  return {
    data,
    isLoading,
    isRefetching,
  };

}
//
// export function mutateAdminPolicy() {
//   const { mutate, isLoading } = useAdminCustomPost<
//     AdminPolicyReq,
//     AdminPolicyRes
//   >(
//     `/policies`,
//     ["policies-r"],
//   )
//
//   return {
//     mutate,
//     isLoading
//   }
// }
//

export default useAdminGroupPolicies;
