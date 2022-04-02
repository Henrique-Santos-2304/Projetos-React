import style from "./style.module.scss"
import Image from "next/image"
import Programador from "../../../public/assets/programing.png"
import ButtonSubscribe from "./ButtonSubscribe"
import { FaWhatsapp } from "react-icons/fa"

interface valueProps {
   value: number
   id: string
}

export function SectionHome({ value }: valueProps) {
   return (
      <main className={style.mainContainer}>
         <section className={style.sectionContent}>
            <p>👏 Olá, Seja bem vindo</p>
            <ul>
               <li>
                  <h1>Fique por dentro das notícias do mundo da tecnologia</h1>
               </li>
               <li>
                  <p className={style.ListP}>
                     Receba notícias direto no E-mail e WhatsApp
                     <FaWhatsapp
                        color="#1FED18"
                        className={style.whatsIcon}
                     />{" "}
                     <br />
                  </p>
               </li>
            </ul>
            <p className={style.valuePrice}>R${value.toFixed(2)} mês</p>
            <ButtonSubscribe />
         </section>
         <div className={style.imagePrograming}>
            <Image src={Programador} alt="Image Programing" />
         </div>
      </main>
   )
}
