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
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Email and password required");
    if (mode === "register") {
      if (!name) return toast.error("Full name required");
      if (!dob) return toast.error("Date of birth required");
      if (password !== confirm) return toast.error("Passwords do not match");
    }
    login({ name: name || email.split("@")[0], email, phone });
    toast.success(mode === "login" ? "Welcome back!" : "Account created");
    navigate({ to: "/" });
  };

  // Mock social logins — frontend-only demo
  const social = (provider: "Google" | "Facebook") => {
    const demo = {
      Google: { name: "Google User", email: "user@gmail.com" },
      Facebook: { name: "FB User", email: "user@facebook.com" },
    }[provider];
    login({ name: demo.name, email: demo.email });
    toast.success(`Signed in with ${provider}`);
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
              <>
                <input className={ic} placeholder="Mobile" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <label className="block">
                  <span className="text-[11px] text-muted-foreground ml-1">Date of birth</span>
                  <input
                    className={ic + " mt-1"}
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </label>
              </>
            )}
            <input className={ic} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {mode === "register" && (
              <input
                className={ic}
                placeholder="Confirm password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            )}
            <button className="mt-2 py-3 rounded-2xl bg-gradient-primary text-primary-foreground font-bold shadow-glow">
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="flex-1 h-px bg-border" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">or continue with</span>
            <span className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => social("Google")}
              className="h-11 rounded-2xl glass flex items-center justify-center gap-2 text-sm font-semibold hover:scale-[1.02] transition"
            >
              <GoogleIcon /> Google
            </button>
            <button
              type="button"
              onClick={() => social("Facebook")}
              className="h-11 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold text-white hover:scale-[1.02] transition"
              style={{ background: "#1877F2" }}
            >
              <FacebookIcon /> Facebook
            </button>
          </div>

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

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#FFC107" d="M21.8 10.2H12v3.9h5.6c-.5 2.5-2.7 3.9-5.6 3.9-3.4 0-6.1-2.7-6.1-6s2.7-6 6.1-6c1.5 0 2.9.5 4 1.5l2.8-2.8C16.9 3.1 14.6 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4 9.6-9.7 0-.7-.1-1.4-.2-2.1z" />
      <path fill="#FF3D00" d="M3.2 7.3l3.2 2.4c.9-2.2 3-3.7 5.6-3.7 1.5 0 2.9.5 4 1.5l2.8-2.8C16.9 3.1 14.6 2 12 2 8.1 2 4.7 4.2 3.2 7.3z" />
      <path fill="#4CAF50" d="M12 22c2.5 0 4.8-.9 6.6-2.5l-3-2.5c-1 .7-2.2 1.1-3.6 1.1-2.9 0-5.1-1.5-5.6-3.9l-3.2 2.5C4.7 19.7 8.1 22 12 22z" />
      <path fill="#1976D2" d="M21.8 10.2H12v3.9h5.6c-.3 1.3-1 2.4-2 3.1l3 2.5c1.7-1.6 2.8-4 2.8-7.4 0-.7-.1-1.4-.2-2.1z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-white" aria-hidden>
      <path d="M22 12a10 10 0 10-11.6 9.9v-7H8v-2.9h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5v1.8h2.6l-.4 2.9h-2.2v7A10 10 0 0022 12z" />
    </svg>
  );
}
