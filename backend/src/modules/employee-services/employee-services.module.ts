import { Module } from "@nestjs/common";
import { EmployeeServicesController } from "./employee-services.controller";
import { EmployeeServicesRepository } from "./employee-services.repository";
import { EmployeeServicesService } from "./employee-services.service";

@Module({
  controllers: [EmployeeServicesController],
  providers: [EmployeeServicesService, EmployeeServicesRepository]
})
export class EmployeeServicesModule {}
