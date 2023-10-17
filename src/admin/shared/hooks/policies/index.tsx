import {useAdminCustomQuery} from "medusa-react"
import {useParams} from "react-router-dom"

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

const BlogPost = () => {
    const {id} = useParams()

    const {data, isLoading} = useAdminCustomQuery<
        AdminPolicyQuery,
        AdminPoliciesRes
    >(
        `/policies`,  // path
        ["admin-policies-list"], // queryKey
    )

    console.log(data);
    return (
        <>
            {isLoading && <span>Loading...</span>}
            {data?.policies?.map((policy) => (
                <div key={policy.id}>
                    <span>{policy.name}</span>
                    {/* Add more details as needed */}
                </div>
            ))}
        </>
    )
}

export default BlogPost