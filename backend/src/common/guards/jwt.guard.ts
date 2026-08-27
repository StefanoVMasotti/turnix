import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../database/prisma/prisma.service";
import { SupabaseService } from "../services/supabase.service";
import { AuthUser } from "../decorators/current-user.decorator";

interface AuthRequest extends Request {
  user?: AuthUser;
}

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException("Token de autenticación requerido.");
    }

    try {
      const supabaseUser = await this.supabase.verifyToken(token);

      const user = await this.prisma.user.findUnique({
        where: { authUserId: supabaseUser.sub }
      });

      if (!user || !user.active) {
        throw new UnauthorizedException("Usuario no encontrado o desactivado.");
      }

      request.user = {
        id: user.id,
        authUserId: user.authUserId,
        email: user.email,
        name: user.name,
        role: user.role,
        businessId: user.businessId
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Token inválido o expirado.");
    }
  }

  private extractToken(request: AuthRequest): string | null {
    const authHeader = request.headers.authorization;

    if (!authHeader || typeof authHeader !== "string") {
      return null;
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return null;
    }

    return token;
  }
}
