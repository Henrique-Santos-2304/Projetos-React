import { GetStaticProps } from "next"
import Head from "next/head"
import { SectionHome } from "../components/SectionHome"
import { stripe } from "../services/stripe"

interface HomeProps {
   product: {
      productId: string
      amount: number
   }
}

export default function Home({ product }: HomeProps) {
   const { productId, amount } = product
   return (
      <>
         <Head>
            <title>techNews</title>
         </Head>

         <SectionHome value={amount} id={productId} />
      </>
   )
}

export const getStaticProps: GetStaticProps = async () => {
   const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID)
   const product = {
      productId: price.id,
      amount: price.unit_amount / 100
   }
   return {
      props: {
         product
      },
      revalidate: 60 * 60 * 24 //1 dia(24horas)
   }
}
