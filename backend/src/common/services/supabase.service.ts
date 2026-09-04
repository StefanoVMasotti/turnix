import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseUser {
  id: string;
  email: string;
  aud: string;
  role: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  aud: string;
  exp: number;
  iat: number;
}

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client!: SupabaseClient;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const url = this.config.get<string>("SUPABASE_URL");
    const key = this.config.get<string>("SUPABASE_ANON_KEY");

    if (!url || !key) {
      throw new Error("SUPABASE_URL y SUPABASE_ANON_KEY son requeridos.");
    }

    this.client = createClient(url, key);
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    // Validar exp LOCALMENTE antes de llamar a Supabase
    const payload = this.decodeJwt(token);
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw new Error("Token expirado");
    }
    
    const { data, error } = await this.client.auth.getUser(token);

    if (error || !data.user) {
      throw new Error("Token inválido o expirado.");
    }

    return {
      sub: data.user.id,
      email: data.user.email ?? "",
      role: data.user.role ?? "authenticated",
      aud: "authenticated",
      exp: payload.exp,
      iat: payload.iat
    };
  }

  decodeJwt(token: string): TokenPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const json = Buffer.from(base64, 'base64').toString();
      return JSON.parse(json);
    } catch {
      throw new Error("Token malformado");
    }
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async signOut(token: string) {
    const { error } = await this.client.auth.admin.signOut(token);

    if (error) {
      throw error;
    }
  }
}
