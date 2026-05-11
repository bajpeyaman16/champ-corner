import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/app-store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Login — Eventra" }] }),
});

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Email and password required");
    login({ name: name || email.split("@")[0], email, phone });
    toast.success(mode === "login" ? "Welcome back!" : "Account created");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl font-bold text-gradient-gold">EVENTRA</h1>
          <p className="text-sm text-muted-foreground mt-1">Premium sports event platform</p>
        </div>

        <div className="glass-strong rounded-3xl p-6">
          <div className="flex gap-2 p-1 glass rounded-xl">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize ${
                  mode === m ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-5 grid gap-3">
            {mode === "register" && (
              <input className={ic} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <input className={ic} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {mode === "register" && (
              <input className={ic} placeholder="Mobile" value={phone} onChange={(e) => setPhone(e.target.value)} />
            )}
            <input className={ic} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {mode === "register" && (
              <input className={ic} placeholder="Confirm password" type="password" />
            )}
            <button className="mt-2 py-3 rounded-2xl bg-gradient-primary text-primary-foreground font-bold shadow-glow">
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-muted-foreground underline">Continue as guest</Link>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground text-center mt-4">
          Frontend demo — auth runs locally in your browser.
        </p>
      </div>
    </div>
  );
}

const ic = "w-full h-12 px-4 rounded-xl glass text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground";
