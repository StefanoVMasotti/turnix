import { Module } from "@nestjs/common";
import { TimeOffController } from "./time-off.controller";
import { TimeOffRepository } from "./time-off.repository";
import { TimeOffService } from "./time-off.service";

@Module({
  controllers: [TimeOffController],
  providers: [TimeOffService, TimeOffRepository]
})
export class TimeOffModule {}
