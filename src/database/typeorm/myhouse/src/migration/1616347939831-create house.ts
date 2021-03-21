import {MigrationInterface, QueryRunner} from "typeorm";

export class createHouse1616347939831 implements MigrationInterface {
    name = 'createHouse1616347939831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "house" ("id" SERIAL NOT NULL, "name" character varying(60) NOT NULL, "members" integer array NOT NULL, CONSTRAINT "PK_8c9220195fd0a289745855fe908" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "house"`);
    }

}
