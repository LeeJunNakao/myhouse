import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPurchaseTable1617374717316 implements MigrationInterface {
  name = 'createPurchaseTable1617374717316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "purchase" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "houseId" integer NOT NULL, "date" integer NOT NULL, "description" character varying(60) NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id"))');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "purchase"');
  }
}
