import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfig {
  constructor(private readonly config: ConfigService) {}

  get port(): number {
    return this.config.get<number>("PORT") ?? 3000;
  }

  get corsOrigin(): string {
    return this.config.get<string>("CORS_ORIGIN") ?? "http://localhost:5173";
  }

  get jwtSecret(): string {
    return this.config.get<string>("JWT_SECRET") ?? "change-me";
  }

  get nodeEnv(): string {
    return this.config.get<string>("NODE_ENV") ?? "development";
  }
}
