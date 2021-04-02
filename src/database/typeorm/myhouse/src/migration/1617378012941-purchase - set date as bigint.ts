import { MigrationInterface, QueryRunner } from 'typeorm';

export class purchaseSetDateAsBigint1617378012941 implements MigrationInterface {
  name = 'purchase -SetDateAsBigint1617378012941';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "purchase" DROP COLUMN "date"');
    await queryRunner.query('ALTER TABLE "purchase" ADD "date" bigint NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "purchase" DROP COLUMN "date"');
    await queryRunner.query('ALTER TABLE "purchase" ADD "date" integer NOT NULL');
  }
}
