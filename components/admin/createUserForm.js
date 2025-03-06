"use client";

import PasswordInput from "../generics/form/passwordInput";
import TextInput from "../generics/form/textInput";
import EmailInput from "../generics/form/emailInput";
import SelectInput from "../generics/form/selectInput";
import { handleCreateUser } from "@/lib/actions";
import { useActionState } from "react";
import ErrorMsgs from "../generics/form/errorMsgs";

export default function CreateUserForm({ classes, roleOptions, userId }) {
  const bindedHandleCreateUser = (prevState, formData) =>
    handleCreateUser(prevState, formData, userId);
  const [formState, formAction] = useActionState(bindedHandleCreateUser, {});

  let errorDisplay;

  if (formState.errors) {
    errorDisplay = <ErrorMsgs errors={formState.errors} />;
  }

  return (
    <form action={formAction} className={classes["createUser-form"]}>
      <h1 className={classes["createUser-header"]}>Log into Account</h1>
      <fieldset className={classes["createUser-fields"]}>
        <TextInput
          fieldClassName={classes["createUser-field"]}
          inputName="username"
        >
          Username
        </TextInput>
        <PasswordInput
          fieldClassName={classes["createUser-field"]}
          inputName="password"
        >
          Password
        </PasswordInput>
        <PasswordInput
          fieldClassName={classes["createUser-field"]}
          inputName="passwordCfm"
        >
          Confirm Password
        </PasswordInput>
        <EmailInput
          fieldClassName={classes["createUser-field"]}
          inputName="email"
        >
          Email
        </EmailInput>
        <SelectInput
          fieldClassName={classes["createUser-field"]}
          inputName="role"
          options={roleOptions}
          selectedValue={null}
        >
          Role
        </SelectInput>
        {formState.errors ? errorDisplay : null}
        <button type="submit" className={classes["createUser-button"]}>
          Create User
        </button>
      </fieldset>
    </form>
  );
}
