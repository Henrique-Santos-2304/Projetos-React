import SignInButton from "./SignInButton"
import style from "./style.module.scss"

import ActiveLink from "../ActiveLink"

export default function Header() {
   const { headerContainer, divContent, active } = style
   return (
      <header className={headerContainer}>
         <div className={divContent}>
            <div>
               <p>
                  Tech<span>News</span>
               </p>
            </div>
            <nav>
               <ActiveLink activeClassName={active} href="/">
                  <a>Home</a>
               </ActiveLink>
               <ActiveLink activeClassName={active} href={`/posts?`}>
                  <a>Posts</a>
               </ActiveLink>
            </nav>
            <SignInButton />
         </div>
      </header>
   )
}
