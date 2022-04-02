import { cloneElement, ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface ActiveProps {
   children: ReactElement;
   activeClassName: string;
   href: string;
}

export default function ActiveLink({
   children,
   activeClassName,
   ...rest
}: ActiveProps) {
   const { asPath } = useRouter();
   const className = asPath === rest.href ? activeClassName : "";
   return <Link {...rest}>{cloneElement(children, { className })}</Link>;
}
