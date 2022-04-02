import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscribeUser } from "./_lib/manageSubscribe";

// TRansformar os dados recebidos em straeming para string
async function buffer(readeable: Readable) {
   const chunks = [];
   for await (const chunk of readeable) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
   }
   return Buffer.concat(chunks);
}
// Habilitar leituras externas Node
export const config = {
   api: {
      bodyParser: false,
   },
};
// filtra Somente os eventos que queremos receber do Stripe WebHook
const filteredEventWebhook = new Set([
   "checkout.session.completed",
   "customer.subscription.deleted",
   "customer.subscription.created",
   "customer.subscription.updated",
]);
//eslint-disable-next-line
export default async (req: NextApiRequest, res: NextApiResponse) => {
   if (req.method === "POST") {
      const buf = await buffer(req);
      const secret = req.headers["stripe-signature"];

      // Captura o evento de recebimento do stripe webHook
      let event: Stripe.Event;
      try {
         event = stripe.webhooks.constructEvent(
            buf,
            secret,
            process.env.STRIPE_SECRET_LISTEN_KEY
         );
      } catch (err) {
         return res.status(400).send("WeebhHook Status Erro");
      }
      const type = event.type;
      // TRatamento de eventos recebidos do stripe webHook

      if (filteredEventWebhook.has(type)) {
         // filtro de eventos necessários
         const create = type === "checkout.session.completed";
         const subscription = event.data.object as Stripe.Subscription;
         const checkoutSession = event.data.object as Stripe.Checkout.Session;

         // Envio os parãmetro para salvar inscrição banco de dados de acordo
         //  com evento recebido Api de inscrição
         if (create) {
            await saveSubscribeUser(
               checkoutSession.subscription.toString(),
               true
            );
         } else {
            await saveSubscribeUser(
               subscription.id,
               type === "customer.subscription.created" ? true : false
            );
         }
      }
      return res.json({ EventComplete: true });
   }
};
