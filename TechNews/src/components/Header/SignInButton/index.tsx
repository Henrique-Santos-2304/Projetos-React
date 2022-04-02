import { signIn, signOut, useSession } from "next-auth/client"
import Image from "next/image"
import { FaGithub, FaGoogle } from "react-icons/fa"
import style from "./style.module.scss"

export default function SignInButton() {
   const [session] = useSession()

   const renderSession = session ? (
      <button
         data-testid="userLogged"
         className={style.buttonSignOut}
         onClick={() => signOut()}
      >
         {/* eslint-disable-next-line */}
         <Image
            src={session.user.image}
            width="40%"
            height="30%"
            className={style.loggedUser}
         />
         <p>{session.user.name}</p>
      </button>
   ) : (
      <>
         <button
            data-testid="signInWithGitHub"
            className={style.buttonSignIn}
            onClick={() => signIn("github")}
         >
            <FaGithub color="#383535" />
         </button>
         <button
            data-testid="signInWithGoogle"
            id={style.google}
            className={style.buttonSignIn}
            onClick={() => signIn("google")}
         >
            <FaGoogle color="#DB0620" />
         </button>
      </>
   )

   return renderSession
}
