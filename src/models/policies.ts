import {
    Entity,
    Column,
    Index,
    BeforeInsert,
} from "typeorm";
import {generateEntityId} from "@medusajs/medusa/dist/utils";
import _ from "lodash";
import {SoftDeletableEntity} from "@medusajs/medusa";

@Entity()
export class Policies extends SoftDeletableEntity {
    @Index({unique: true})
    @Column({type: "varchar"})
    name: string;

    @Index({unique: true})
    @Column({type: "varchar"})
    handle: string;

    @Column({type: "varchar", nullable: true})
    description: string;

    @Column({type: "varchar"})
    method: string;

    @Column({type: "varchar"})
    base_router: string;

    @Column({type: "varchar", nullable: true})
    custom_regex: string;

    @BeforeInsert()
    private handleBeforeInsert(): void {
        if (this.id) return

        this.id = generateEntityId(this.id, "policy")
        if (!this.handle) {
            this.handle = _.kebabCase(this.name);
        }
    }

}
