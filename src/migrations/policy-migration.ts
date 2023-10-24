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
        name: "policy",
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
        name: "policy_cluster",
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

    await queryRunner.createTable(
      new Table({
        name: "policy_cluster_policy",
        columns: [
          {
            name: "policyClusterId",
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
      "policy_cluster_policy",
      new TableForeignKey({
        columnNames: ["policyClusterId"],
        referencedColumnNames: ["id"],
        referencedTableName: "policy_cluster",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    )

    await queryRunner.createForeignKey(
      "policy_cluster_policy",
      new TableForeignKey({
        columnNames: ["policyId"],
        referencedColumnNames: ["id"],
        referencedTableName: "policy",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    )

    await queryRunner.addColumn(
      "user",
      new TableColumn({
        name: "policy_cluster",
        type: "varchar",
        isNullable: true,
      })
    )

    await queryRunner.createForeignKey(
      "user",
      new TableForeignKey({
        columnNames: ["policy_cluster"],
        referencedColumnNames: ["id"],
        referencedTableName: "policy_cluster",
        onDelete: "SET NULL",
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const usersTable = await queryRunner.getTable("user")
    const usersForeignKey = usersTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("policy_cluster") !== -1
    )
    await queryRunner.dropForeignKey("user", usersForeignKey)

    await queryRunner.dropColumn("user", "policy_cluster")

    const policiesGroupPoliciesTable = await queryRunner.getTable(
      "policy_cluster_policy"
    )
    const foreignKey1 = policiesGroupPoliciesTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("policyClusterId") !== -1
    )
    const foreignKey2 = policiesGroupPoliciesTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("policyId") !== -1
    )

    await queryRunner.dropForeignKeys("policy_cluster_policy", [
      foreignKey1,
      foreignKey2,
    ])
    await queryRunner.dropTable("policy_cluster_policy")

    await queryRunner.dropTable("policy_cluster")
    await queryRunner.dropTable("policy")
  }
}
