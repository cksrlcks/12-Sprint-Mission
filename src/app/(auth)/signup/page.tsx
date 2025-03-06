import { redirect } from "next/navigation";
import AuthContainer from "@/components/auth/AuthContainer";
import SignupForm from "@/components/auth/SignupForm";
import { cookies } from "next/headers";

export default async function SignupPage() {
  const session = ((await cookies()).get('accessToken'))?.value;

  if (session) {
    redirect("/");
  }

  return (
    <AuthContainer mode="signup">
      <SignupForm />
    </AuthContainer>
  );
}
