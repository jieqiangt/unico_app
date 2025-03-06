"use client";

import { handleLogin } from "@/lib/actions";
import PasswordInput from "../generics/form/passwordInput";
import TextInput from "../generics/form/textInput";
import { useActionState } from "react";
import ErrorMsgs from "../generics/form/errorMsgs";

export default function LoginForm({ classes }) {
  const [formState, formAction] = useActionState(handleLogin, {});

  let errorDisplay;
  if (formState.errors) {
    errorDisplay = <ErrorMsgs errors={formState.errors} />;
  }
  return (
    <form action={formAction} className={classes["login-form"]}>
      <h1 className={classes["login-header"]}>Log into Account</h1>
      <fieldset className={classes["login-fields"]}>
        <TextInput fieldClassName={classes["login-field"]} inputName="username">
          Username
        </TextInput>
        <PasswordInput
          fieldClassName={classes["login-field"]}
          inputName="password"
        >
          Password
        </PasswordInput>
        {formState.errors ? errorDisplay : null}
        <button type="submit" className={classes["login-button"]}>
          Login
        </button>
      </fieldset>
      <p className={classes["login-info"]}>
        Do not have an account? Please approach admin for account creation.
      </p>
    </form>
  );
}
