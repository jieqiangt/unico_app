import Link from "next/link";
import logo from "@/assets/logo.png";
import NavLink from "../generics/navLink";
import Image from "next/image";
import classes from "./mainHeader.module.scss";
import { handleLogOut } from "@/lib/actions";

export default function MainHeader({ roleId }) {
  return (
    <header className={classes["header"]}>
      <Link className={classes["header-logo"]} href="/">
        <Image src={logo} alt="Unico Foods Logo" priority />
      </Link>
      <ul className={classes["header-nav"]}>
        <NavLink href="/confirmed"> Confirmed</NavLink>
        <NavLink href="/active">Active</NavLink>
        {roleId == 1 ? <NavLink href="/admin">Admin</NavLink> : null}
        <form action={handleLogOut}>
          <button>Log Out</button>
        </form>
      </ul>
    </header>
  );
}
