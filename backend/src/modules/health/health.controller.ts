import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

type HealthResponse = {
  status: "ok";
  service: "turnix-api";
};

@ApiTags("Health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOkResponse({
    description: "Estado básico de la API."
  })
  getHealth(): HealthResponse {
    return {
      status: "ok",
      service: "turnix-api"
    };
  }
}
