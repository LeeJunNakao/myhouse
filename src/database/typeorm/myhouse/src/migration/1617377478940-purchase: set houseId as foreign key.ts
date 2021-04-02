import { MigrationInterface, QueryRunner } from 'typeorm';

export class purchaseSetHouseIdAsForeignKey1617377478940 implements MigrationInterface {
  name = 'purchase:SetHouseIdAsForeignKey1617377478940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "purchase" ALTER COLUMN "houseId" DROP NOT NULL');
    await queryRunner.query('COMMENT ON COLUMN "purchase"."houseId" IS NULL');
    await queryRunner.query('ALTER TABLE "purchase" ADD CONSTRAINT "FK_bfa0e232eeb46000a4c0e485245" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "purchase" DROP CONSTRAINT "FK_bfa0e232eeb46000a4c0e485245"');
    await queryRunner.query('COMMENT ON COLUMN "purchase"."houseId" IS NULL');
    await queryRunner.query('ALTER TABLE "purchase" ALTER COLUMN "houseId" SET NOT NULL');
  }
}
