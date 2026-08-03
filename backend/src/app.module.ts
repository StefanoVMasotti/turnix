import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppConfig } from "./config/app.config";
import { PrismaModule } from "./database/prisma/prisma.module";
import { BlocksModule } from "./modules/blocks/blocks.module";
import { BusinessModule } from "./modules/business/business.module";
import { AppointmentsModule } from "./modules/appointments/appointments.module";
import { ClientsModule } from "./modules/clients/clients.module";
import { EmployeeServicesModule } from "./modules/employee-services/employee-services.module";
import { EmployeesModule } from "./modules/employees/employees.module";
import { HealthModule } from "./modules/health/health.module";
import { SchedulesModule } from "./modules/schedules/schedules.module";
import { ServicesModule } from "./modules/services/services.module";
import { TimeOffModule } from "./modules/time-off/time-off.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    HealthModule,
    BusinessModule,
    ServicesModule,
    EmployeesModule,
    EmployeeServicesModule,
    SchedulesModule,
    TimeOffModule,
    BlocksModule,
    ClientsModule,
    AppointmentsModule
  ],
  providers: [AppConfig],
  exports: [AppConfig]
})
export class AppModule {}
