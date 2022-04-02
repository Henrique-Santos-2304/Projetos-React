import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { useState } from "react";

import { FaWhatsapp } from "react-icons/fa";

import { getPrismicApi } from "../../services/prismic";

import style from "./post.module.scss";

type PostsProps = {
   post: {
      slug: string;
      title: string;
      content: string;
      updateDate: string;
   };
   session: any;
};

export default function Slug({ post, session }: PostsProps) {
   const [modal, setModal] = useState(false);
   const [buttonNews, setButtonNews] = useState(false);

   const handleButton = (modal, button) => {
      setTimeout(() => {
         setModal(modal);
      }, 200);
      setButtonNews(button);
   };

   return (
      <>
         <Head>
            <title> {post.title} </title>
         </Head>
         <main className={style.mainContainer}>
            <div className={style.posts}>
               <div className={style.description}>
                  <time>{post.updateDate}</time>
                  <strong>{post.title}</strong>
               </div>
               <div
                  className={style.postContent}
                  dangerouslySetInnerHTML={{ __html: post.content }}
               ></div>
            </div>
            {buttonNews && (
               <section className={style.sectionForm}>
                  <button onClick={() => handleButton(true, false)}>
                     Cadastrar{" "}
                     <FaWhatsapp color="#1FED18" className={style.whats} />
                  </button>
               </section>
            )}
         </main>
      </>
   );
}

// Página dinâmica de acordo com cada post
export const getServerSideProps: GetServerSideProps = async ({
   req,
   params,
}) => {
   // Pegar se o usuario está Logado
   const session = await getSession({ req });
   const { slug } = params;

   if (!session?.activeSubscription) {
      return {
         redirect: {
            destination: `/posts/preview/${slug}`,
            permanent: false,
         },
      };
   }

   // redireciona Usuario caso não tenha assinatura ativa

   const prismic = await getPrismicApi(req);

   const response = await prismic.getByUID("post", String(slug), {});

   const post = {
      slug,
      title: RichText.asText(response.data.title),
      content: RichText.asHtml(response.data.content),
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
      props: { post, session },
   };
};
