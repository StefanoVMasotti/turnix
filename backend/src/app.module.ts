import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { AppConfig } from "./config/app.config";
import { SupabaseModule } from "./common/supabase.module";
import { PrismaModule } from "./database/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BlocksModule } from "./modules/blocks/blocks.module";
import { BusinessModule } from "./modules/business/business.module";
import { AppointmentsModule } from "./modules/appointments/appointments.module";
import { ClientsModule } from "./modules/clients/clients.module";
import { EmployeeServicesModule } from "./modules/employee-services/employee-services.module";
import { EmployeesModule } from "./modules/employees/employees.module";
import { HealthModule } from "./modules/health/health.module";
import { PublicModule } from "./modules/public/public.module";
import { SchedulesModule } from "./modules/schedules/schedules.module";
import { ServicesModule } from "./modules/services/services.module";
import { TimeOffModule } from "./modules/time-off/time-off.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ThrottlerModule.forRoot([{
      name: "default",
      ttl: 60000,
      limit: 20
    }]),
    PrismaModule,
    SupabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    BusinessModule,
    ServicesModule,
    EmployeesModule,
    EmployeeServicesModule,
    SchedulesModule,
    TimeOffModule,
    BlocksModule,
    ClientsModule,
    AppointmentsModule,
    PublicModule
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    AppConfig
  ],
  exports: [AppConfig]
})
export class AppModule {}
