import {Column, Entity, JoinColumn, ManyToOne} from "typeorm"
import {
    User as MedusaUser,
} from "@medusajs/medusa"
import {PoliciesGroup} from "./policies-group";

@Entity()
export class User extends MedusaUser{
    @ManyToOne(() => PoliciesGroup, (groupPolicy) => groupPolicy.users)
    @JoinColumn({ name: "policies_group_id" })
    permission_group: PoliciesGroup
}
