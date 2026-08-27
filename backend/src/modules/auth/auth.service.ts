import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { SupabaseService } from "../../common/services/supabase.service";
import { LoginDto } from "./dto/login.dto";

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    businessId: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService
  ) {}

  async login(dto: LoginDto): Promise<LoginResponse> {
    const result = await this.supabase.signIn(dto.email, dto.password);

    const user = await this.prisma.user.findUnique({
      where: { authUserId: result.user.id }
    });

    if (!user || !user.active) {
      throw new UnauthorizedException("Usuario no encontrado o desactivado.");
    }

    return {
      access_token: result.session.access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessId: user.businessId
      }
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        businessId: true
      }
    });

    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado.");
    }

    return user;
  }
}
