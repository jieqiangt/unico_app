import LoginForm from "@/components/login/loginForm";
import classes from "./page.module.scss";
import loginImg from "@/assets/loginImgVertical.jpg";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className={classes["login"]}>
      <section className={classes["login-imgSection"]}>
        <Image
          src={loginImg}
          alt="Image of fresh seafood on top of ice"
          priority
        />
      </section>
      <section className={classes["login-formSection"]}>
        <LoginForm classes={classes} />
      </section>
    </main>
  );
}
