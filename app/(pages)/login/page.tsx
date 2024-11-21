import Wrapper from "@/components/custom/wrapper";
import LoginForm from "@/components/forms/login-form";

export default async function Login() {
  return (
    <Wrapper className="flex justify-center items-center">
      <LoginForm />
    </Wrapper>
  );
}
