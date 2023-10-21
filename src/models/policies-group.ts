import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  JoinTable,
  ManyToMany,
} from "typeorm"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import _ from "lodash"
import { SoftDeletableEntity } from "@medusajs/medusa"
import { Policies } from "./policies"

@Entity()
export class PoliciesGroup extends SoftDeletableEntity {
  @Index({ unique: true })
  @Column({ type: "varchar" })
  name: string

  @Index({ unique: true })
  @Column({ type: "varchar" })
  handle: string

  @Column({ type: "varchar", nullable: true })
  description: string

  @ManyToMany(() => Policies, { cascade: ["remove", "soft-remove"] })
  @JoinTable({
    name: "policies_group_policies",
    joinColumn: {
      name: "policiesGroupId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "policyId",
      referencedColumnName: "id",
    },
  })
  policies: Policies[]

  @BeforeInsert()
  private handleBeforeInsert(): void {
    if (this.id) {
      return
    }

    this.id = generateEntityId(this.id, "policy_group")
    if (!this.handle) {
      this.handle = _.kebabCase(this.name)
    }
  }
}
