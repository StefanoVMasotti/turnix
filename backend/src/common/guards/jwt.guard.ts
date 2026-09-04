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
  private userCache = new Map<string, { user: AuthUser; expiry: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 min
  private readonly MAX_CACHE_SIZE = 1000;

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

    // 1. CHECK CACHE
    const cached = this.userCache.get(token);
    if (cached && cached.expiry > Date.now()) {
      request.user = cached.user;
      return true;
    }

    try {
      // 2. VALIDAR TOKEN (incluye validación exp local en supabase.verifyToken)
      const supabaseUser = await this.supabase.verifyToken(token);

      const user = await this.prisma.user.findUnique({
        where: { authUserId: supabaseUser.sub }
      });

      if (!user || !user.active) {
        throw new UnauthorizedException("Usuario no encontrado o desactivado.");
      }

      const authUser: AuthUser = {
        id: user.id,
        authUserId: user.authUserId,
        email: user.email,
        name: user.name,
        role: user.role,
        businessId: user.businessId
      };

      request.user = authUser;

      // 3. CACHEAR
      this.userCache.set(token, { user: authUser, expiry: Date.now() + this.CACHE_TTL });

      // 4. CLEANUP PERIÓDICO
      if (this.userCache.size > this.MAX_CACHE_SIZE) {
        this.cleanupCache();
      }

      return true;
    } catch (error: any) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      const msg = error?.message || "";
      if (msg.includes("expirado")) throw new UnauthorizedException("Token expirado");
      if (msg.includes("malformado")) throw new UnauthorizedException("Token malformado");
      if (msg.includes("Usuario no encontrado")) throw new UnauthorizedException("Usuario no encontrado o desactivado");
      
      throw new UnauthorizedException("Token inválido o error de autenticación");
    }
  }

  private cleanupCache() {
    const now = Date.now();
    for (const [key, value] of this.userCache.entries()) {
      if (value.expiry < now) this.userCache.delete(key);
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
