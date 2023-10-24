import {PoliciesGroup} from "./models/policies-group";

export declare module "@medusajs/medusa/dist/models/user" {
    declare interface User {
        permission_group: PoliciesGroup
    }
}