export declare type CreatePolicy = {
    name: string;
    handle?: string;
    description?: string;
    method: string;
    base_router: string;
    custom_regex?: string;
}

export declare type UpdatePolicy = {
    name?: string
    handle?: string;
    description?: string;
    method?: string;
    base_router?: string;
    custom_regex?: string;
}