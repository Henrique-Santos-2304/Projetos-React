import { useSession } from "next-auth/client"
import { useRouter } from "next/router"
import { useState } from "react"
import { api } from "../../../services/apiAxios"
import { getStripeFront } from "../../../services/stripeFrontEnd"
import style from "./style.module.scss"

export default function ButtonSubscribe() {
   const [session] = useSession()
   const router = useRouter()
   const [log, setLog] = useState(true)

   async function handleSession() {
      // Checa se já está logado na conta
      if (session) {
         setLog(true)
         if (session.activeSubscription) {
            router.push("/posts")
         } else {
            // Redirecionamento para Inscrição no Stripe
            const response = await api.post("/subscribe")
            const { sessionId } = response.data
            const stripe = await getStripeFront()
            await stripe.redirectToCheckout({ sessionId })
         }
      } else {
         router.push("/")
         // setLog(false)
         // setTimeout(() => {
         //    setLog(true)
         // }, 1500)
      }
      // Checa se o Usuario tem assinatura ativa para direcionamento de página
   }
   return (
      <>
         <button
            data-testid="toggle"
            type="button"
            className={style.buttonSubscript}
            onClick={handleSession}
         >
            Inscreva-se
         </button>
         {!log ? (
            <div>
               <p>Faça login para se Inscrever</p>
            </div>
         ) : null}
      </>
   )
}
