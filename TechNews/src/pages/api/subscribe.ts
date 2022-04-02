import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb";
import { getSession } from "next-auth/client";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
   ref: {
      id: string;
   };
   data: {
      stripeCustomerId: string;
   };
};

// eslint-disable-next-line
export default async (req: NextApiRequest, res: NextApiResponse) => {
   if (req.method === "POST") {
      // Pegar o Usuario que esta fazendo a solicitação no \FrontEnd

      const session = await getSession({ req });
      // Pegar O dados do usuario no Banco de Dados
      const user = await fauna.query<User>(
         q.Get(
            q.Match(q.Index("user_by_email"), q.Casefold(session.user.email))
         )
      );
      let customerUser = user.data.stripeCustomerId;
      // Checa se o Usuario já existe no Banco de dados, para não criar Duplicatas
      if (!customerUser) {
         // Cria um usuario no Stripe
         const stripeCustomer = await stripe.customers.create({
            email: session.user.email,
         });

         await fauna.query(
            q.Update(q.Ref(q.Collection("users"), user.ref.id), {
               data: {
                  stripeCustomerId: stripeCustomer.id,
               },
            })
         );

         customerUser = stripeCustomer.id;
      }
      // Dados que serão repassados para inscrição do Stripe
      const stripeCheckoutSession = await stripe.checkout.sessions.create({
         customer: customerUser,
         payment_method_types: ["card"],
         billing_address_collection: "required",
         line_items: [
            {
               price: process.env.STRIPE_PRICE_ID,
               quantity: 1,
            },
         ],
         mode: "subscription",
         allow_promotion_codes: true,
         success_url: "http://localhost:3000",
         cancel_url: "http://localhost:3000",
      });
      return res.status(200).json({ sessionId: stripeCheckoutSession.id });
   } else {
      res.setHeader("ALLOW", "POST"), // AVisa o FrontEnd que só aceita método POst
         res.status(405).end("Method not allowed"); //Retorno do código de erro
   }
};
