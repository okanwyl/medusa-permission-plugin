import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey, Table} from "typeorm"

export class MyMigration1617703530229 implements MigrationInterface {
    name = "myMigration1617703530229"

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Alter 'role' column type to varchar
        await queryRunner.changeColumn("user", "role", new TableColumn({
            name: "role",
            type: "varchar",
            default: "'member'",
        }));

        // Create 'policies' table
        await queryRunner.createTable(new Table({
            name: "permissions",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true,
                },
                {
                    name: "role",
                    type: "varchar",
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: "bjson",
                    type: "jsonb",
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
                {
                    name: "metadata",
                    type: "jsonb",
                    isNullable: true,
                },
            ],


        }));

        // Insert default data to 'policies' table
        await queryRunner.query(`INSERT INTO permissions(id, role, bjson)
                                 VALUES ('permis_01HCVZ6T0PE30T5G98PD36643X', 'member',
                                         '{"canRead": true, "canWrite": false}')`);

        // Add foreign key relation between user and policies based on role
        await queryRunner.createForeignKey("user", new TableForeignKey({
            columnNames: ["role"],
            referencedColumnNames: ["role"],
            referencedTableName: "permissions",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // write you migration here

        // Remove foreign key relation based on role between user and policies tables
        const userTable = await queryRunner.getTable("user");
        const foreignKey = userTable.foreignKeys.find(fk => fk.columnNames.indexOf("role") !== -1);
        await queryRunner.dropForeignKey("user", foreignKey);

        // Drop 'policies' table
        await queryRunner.dropTable("permissions");

        // Recreate the user_role_enum type
        await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM('member', 'developer', 'admin')`);

        // Alter 'role' column type back to user_role_enum
        await queryRunner.changeColumn("user", "role", new TableColumn({
            name: "role",
            type: "user_role_enum",
            default: "'member'::user_role_enum",
        }));
    }
}
