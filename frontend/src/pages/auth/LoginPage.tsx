import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/admin");
    } catch {
      setError("Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-50">Turnix</h1>
          <p className="text-sm text-slate-400 mt-1">Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@turnix.app"
            value={email}
            onChange={(e) => { setEmail(e.target.value); }}
            required
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); }}
            required
          />

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </form>
      </div>
    </div>
  );
}
