import { CardWrapper } from "@/components/custom/card-wrapper";
import Wrapper from "@/components/custom/wrapper";
import LoginForm from "@/components/forms/login-form";

export default function Login() {
  return (
    <Wrapper className="flex justify-center items-center">
      <LoginForm />
    </Wrapper>
  );
}
