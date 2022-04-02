import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";
type User = {
   ref: { id: string };
   data: { status: string; id: string };
};

export async function saveSubscribeUser(
   subscriptionId: string,
   create = false
) {
   const subscriptions = await stripe.subscriptions.retrieve(subscriptionId);
   const { status, id, items } = subscriptions;

   const subscriptionData = {
      id,
      status,
      priceId: items.data[0].price.id,
   };

   const user = await fauna.query<User>(
      q.Get(
         q.Match(q.Index("stripe_by_stripeCustomerId"), subscriptions.customer)
      )
   );

   create
      ? await fauna.query(
           //se Create for true
           q.Update(q.Ref(q.Collection("users"), user.ref.id), {
              data: { subscription: subscriptionData },
           })
        )
      : await fauna.query(
           // senão
           q.Update(q.Ref(q.Collection("users"), user.ref.id), {
              data: {
                 subscription: {
                    status,
                 },
              },
           })
        );
   // Salvar os dados de Incrição paga ativa
}
