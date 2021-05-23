import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertUserIdColumnInTableHouse1616452302310 implements MigrationInterface {
  name = 'insertUserIdColumnInTableHouse1616452302310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "house" ADD "userId" integer NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "house" DROP COLUMN "userId"');
  }
}
