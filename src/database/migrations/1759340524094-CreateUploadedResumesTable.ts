import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUploadedResumesTable1759340524094 implements MigrationInterface {
  name = 'CreateUploadedResumesTable1759340524094';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'uploaded_resumes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 's3_url',
            type: 'text',
          },
          {
            name: 'claude_file_meta',
            type: 'jsonb',
          },
          {
            name: 'feedback',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'uploaded_resumes',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('uploaded_resumes');
  }
}
