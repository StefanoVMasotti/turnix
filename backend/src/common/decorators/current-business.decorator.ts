import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

interface BusinessRequest extends Request {
  businessId: string;
}

export const CurrentBusinessId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<BusinessRequest>();
    return request.businessId;
  }
);
