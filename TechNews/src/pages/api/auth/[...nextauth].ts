import { query as q } from "faunadb";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import { fauna } from "../../../services/fauna";

// Retorna as funções de callback de autenticação do usuario
export default NextAuth({
   providers: [
      Providers.GitHub({
         clientId: process.env.GITHUB_ID,
         clientSecret: process.env.GITHUB_SECRET,
         scope: "read:user",
      }),
      Providers.Google({
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
   ],
   callbacks: {
      // Uni os dados de login e os dados de inscrição no banco de dados
      async session(session) {
         try {
            const userSubscriptionActive = await fauna.query(
               q.Get(
                  q.Intersection([
                     q.Match(
                        q.Index("user_by_email"),
                        q.Casefold(session.user.email)
                     ),
                     q.Match(q.Index("userSubscription_by_status"), "active"),
                  ])
               )
            );
            return {
               ...session,
               activeSubscription: userSubscriptionActive,
            };
         } catch (error) {
            return {
               ...session,
               activeSubscription: null,
            };
         }
      },
      // Cria ou retorna um usuario por emial no banco de dados
      async signIn({ email }) {
         try {
            await fauna.query(
               q.If(
                  q.Not(
                     q.Exists(
                        q.Match(q.Index("user_by_email"), q.Casefold(email))
                     )
                  ),
                  q.Create(q.Collection("users"), { data: { email } }),
                  q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email)))
               )
            );
         } catch {
            return false;
         }
      },
   },
});
