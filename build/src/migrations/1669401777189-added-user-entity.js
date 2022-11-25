"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addedUserEntity1669401777189 = void 0;
class addedUserEntity1669401777189 {
    constructor() {
        this.name = 'addedUserEntity1669401777189';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`);
            yield queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "photo" character varying NOT NULL DEFAULT 'default.png', "verified" boolean NOT NULL DEFAULT false, "verificationCode" text, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE INDEX "email_index" ON "users" ("email") `);
            yield queryRunner.query(`CREATE INDEX "verificationCode_index" ON "users" ("verificationCode") `);
            yield queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "content" character varying NOT NULL, "image" character varying NOT NULL DEFAULT 'default-post.png', "userId" uuid, CONSTRAINT "UQ_2d82eb2bb2ddd7a6bfac8804d8a" UNIQUE ("title"), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_ae05faaa55c866130abef6e1fee"`);
            yield queryRunner.query(`DROP TABLE "posts"`);
            yield queryRunner.query(`DROP INDEX "public"."verificationCode_index"`);
            yield queryRunner.query(`DROP INDEX "public"."email_index"`);
            yield queryRunner.query(`DROP TABLE "users"`);
            yield queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        });
    }
}
exports.addedUserEntity1669401777189 = addedUserEntity1669401777189;
