import { useState } from "react";
import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import { Button, Input } from "@/components";
import { z, ZodError } from "zod";

const emailValidator = z.string().email();

const Login: NextPage = () => {
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(() => {
      if (e.target.value.length === 0) {
        setIsEmailValid(true);
        return e.target.value;
      }
      return e.target.value;
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedEmail = emailValidator.safeParse(email);

    if (!parsedEmail.success) return setIsEmailValid(false);

    setIsEmailValid(true);
    
    return await signIn("email", {
      email,
      callbackUrl: "http://localhost:3000/auth/signup",
    });
  };

  return (
    <div className=" container flex min-h-screen flex-col items-center justify-center">
      <div className="w-72 text-center">
        <form
          className="flex flex-col items-center justify-center gap-4"
          onSubmit={(events) => void handleSubmit(events)}
        >
          <span
            className={`pointer-events-none self-start pl-2 ${
              isEmailValid ? "text-black " : "text-red-500"
            } `}
          >
            Email address is not valid
          </span>
          <Input
            className={isEmailValid ? "" : "border border-red-500"}
            type="text"
            name="email"
            id="email"
            placeholder="Email Address"
            value={email}
            onChange={handleEmailChange}
          />

          <Button type="submit">Login</Button>
        </form>
        <span className="text-sm text-lightGray">OR</span>
        <Button icon="google" onClick={() => void signIn("google")}>
          SignIn With Google
        </Button>
        <Button icon="github" onClick={() => void signIn("github")}>
          SignIn With Github
        </Button>
      </div>
    </div>
  );
};

export default Login;
