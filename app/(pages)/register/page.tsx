import Wrapper from "@/components/custom/wrapper";
import RegisterForm from "@/components/forms/register-form";

export default function Register() {
  return (
    <Wrapper className="flex my-[5rem] justify-center items-center min-h-[70vh]">
      <RegisterForm />
    </Wrapper>
  );
}
