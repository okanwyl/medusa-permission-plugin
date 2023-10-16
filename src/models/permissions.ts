import {
    Entity,
    Column,
    Index,
    BeforeInsert,
} from "typeorm";
// import {BaseEntity, SoftDeletableEntity} from "@medusajs/medusa";
import {DbAwareColumn, generateEntityId} from "@medusajs/medusa/dist/utils";
import _ from "lodash";
import {SoftDeletableEntity} from "@medusajs/medusa";

@Entity()
export class Permissions extends SoftDeletableEntity {
    @Index({unique: true, where: "deleted_at IS NULL"})
    @Column({type: "varchar", primary: true, nullable: false})
    role: string;

    @DbAwareColumn({type: "jsonb", nullable: true})
    bjson: Record<string, unknown>;

    @DbAwareColumn({type: "jsonb", nullable: true})
    metadata: Record<string, unknown>;

    @BeforeInsert()
    private handleBeforeInsert(): void {
        if (this.id) return

        this.id = generateEntityId(this.id, "permis")
        if (!this.role) {
            throw new Error("Role is mandatory for a policy");
        }
        this.role = _.kebabCase(this.role);
    }

}
