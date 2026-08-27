import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { UserRole } from "@prisma/client";

export interface AuthUser {
  id: string;
  authUserId: string;
  email: string;
  name: string;
  role: UserRole;
  businessId: string;
}

interface AuthRequest extends Request {
  user: AuthUser;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  }
);
