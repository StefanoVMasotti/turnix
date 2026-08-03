import { Module } from "@nestjs/common";
import { PublicController } from "./public.controller";
import { PublicService } from "./public.service";
import { PublicRepository } from "./public.repository";

@Module({
  controllers: [PublicController],
  providers: [PublicService, PublicRepository]
})
export class PublicModule {}
