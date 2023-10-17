import {IsString} from "class-validator";

export declare type CreatePoliciesGroup = {
    name: string;
    handle?: string;
    description?: string;
    policies?: CreatePolicyGroupPolicyInput[] | null;
}

export declare type UpdatePoliciesGroup = {
    name?: string;
    handle?: string;
    description?: string;
    policies?: string[];
}

export type CreatePolicyGroupPolicyInput = {
    id: string
}

export class ProductProductCategoryReq {
    @IsString()
    id: string
}
