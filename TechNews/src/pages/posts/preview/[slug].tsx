import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";

import { getPrismicApi } from "../../../services/prismic";

import style from "../post.module.scss";

type PostsPreviwProps = {
   post: {
      slug: string;
      title: string;
      content: string;
      updateDate: string;
   };
};

export default function Preview({ post }: PostsPreviwProps) {
   const [session] = useSession();
   const router = useRouter();

   useEffect(() => {
      if (session?.activeSubscription) {
         router.push(`/posts/${post.slug}`);
      }
   }, [session]);
   return (
      <>
         <Head>
            <title> {post.title} </title>
         </Head>
         <main className={`${style.mainContainer} `}>
            <article className={`${style.posts} ${style.containerPreview}`}>
               <div className={style.description}>
                  <time>{post.updateDate}</time>
                  <strong>{post.title}</strong>
               </div>
               <div
                  className={`${style.postContent} ${style.postPreview}`}
                  dangerouslySetInnerHTML={{ __html: post.content }}
               ></div>
               <div className={style.buttonSubscriptionContinue}>
                  <button>
                     Continuar Leitura?
                     <Link href="/">
                        <a>Inscreva-se</a>
                     </Link>
                  </button>
               </div>
            </article>
         </main>
      </>
   );
}

export const getStaticPaths: GetStaticPaths = async () => {
   return {
      // Recebe dentro de um objeto e params indicando os links que serão
      // carregados de forma
      paths: [],
      fallback: "blocking",
   };
};
// Página dinâmica de acordo com cada post
export const getStaticProps: GetStaticProps = async ({ params }) => {
   const { slug } = params;

   // redireciona Usuario caso não tenha assinatura ativa

   const prismic = await getPrismicApi();

   const response = await prismic.getByUID("post", String(slug), {});

   const post = {
      slug,
      title: RichText.asText(response.data.title),
      content: RichText.asHtml(response.data.content.splice(0, 3)),
      updateDate: new Date(response.last_publication_date).toLocaleDateString(
         "pt-BR",
         {
            day: "2-digit",
            month: "long",
            year: "numeric",
         }
      ),
   };
   return {
      props: { post },
      redirect: 60 * 60, //1hora
   };
};
