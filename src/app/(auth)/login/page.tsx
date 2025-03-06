import { redirect } from "next/navigation";
import AuthContainer from "@/components/auth/AuthContainer";
import LoginForm from "@/components/auth/LoginForm";
import { cookies } from "next/headers";

export default async function LoginPage() {
  const session = ((await cookies()).get('accessToken'))?.value;

  if (session) {
    redirect("/");
  }

  return (
    <AuthContainer>
      <LoginForm />
    </AuthContainer>
  );
}
