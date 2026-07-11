import { Suspense } from "react";
import LoginForm from "./login-form";

export const metadata = {
  title: "Sign in · Interview Coach",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<main style={{ padding: 40, textAlign: "center" }}>Loading…</main>}>
      <LoginForm />
    </Suspense>
  );
}
