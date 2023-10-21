import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm"

export class MyMigration1617703530230 implements MigrationInterface {
  name = "myMigration1617703530230"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "policies",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "handle",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "description",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "method",
            type: "varchar",
          },
          {
            name: "base_router",
            type: "varchar",
          },
          {
            name: "custom_regex",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      })
    )

    await queryRunner.createTable(
      new Table({
        name: "policies_group",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "handle",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "description",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      })
    )

    // Creating the many-to-many join table policies_group_policies
    await queryRunner.createTable(
      new Table({
        name: "policies_group_policies",
        columns: [
          {
            name: "policiesGroupId",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "policyId",
            type: "varchar",
            isPrimary: true,
          },
        ],
      })
    )

    await queryRunner.createForeignKey(
      "policies_group_policies",
      new TableForeignKey({
        columnNames: ["policiesGroupId"],
        referencedColumnNames: ["id"],
        referencedTableName: "policies_group",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    )

    await queryRunner.createForeignKey(
      "policies_group_policies",
      new TableForeignKey({
        columnNames: ["policyId"],
        referencedColumnNames: ["id"],
        referencedTableName: "policies",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    )

    await queryRunner.addColumn(
      "user",
      new TableColumn({
        name: "policies_group_id",
        type: "varchar",
        isNullable: true,
      })
    )

    await queryRunner.createForeignKey(
      "user",
      new TableForeignKey({
        columnNames: ["policies_group_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "policies_group",
        onDelete: "SET NULL",
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const usersTable = await queryRunner.getTable("user")
    const usersForeignKey = usersTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("policies_group_id") !== -1
    )
    await queryRunner.dropForeignKey("user", usersForeignKey)

    await queryRunner.dropColumn("user", "policies_group_id")

    const policiesGroupPoliciesTable = await queryRunner.getTable(
      "policies_group_policies"
    )
    const foreignKey1 = policiesGroupPoliciesTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("policiesGroupId") !== -1
    )
    const foreignKey2 = policiesGroupPoliciesTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("policyId") !== -1
    )

    await queryRunner.dropForeignKeys("policies_group_policies", [
      foreignKey1,
      foreignKey2,
    ])
    await queryRunner.dropTable("policies_group_policies")

    await queryRunner.dropTable("policies_group")
    await queryRunner.dropTable("policies")
  }
}
