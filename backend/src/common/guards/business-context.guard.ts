import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class BusinessContextGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const businessId = request.headers["x-business-id"];

    if (!businessId || typeof businessId !== "string") {
      throw new UnauthorizedException("Header x-business-id requerido.");
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(businessId)) {
      throw new UnauthorizedException("Header x-business-id inválido.");
    }

    (request as Request & { businessId: string }).businessId = businessId;

    return true;
  }
}
