import { GetStaticProps } from "next";
import Head from "next/head";
import { getPrismicApi } from "../../services/prismic";
import style from "./style.module.scss";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";
import Link from "next/link";

type Post = {
   slug: string;
   title: string;
   excerpt: string;
   updateDate: string;
};
interface PostsProps {
   posts: Post[];
}

export default function index({ posts }: PostsProps) {
   return (
      <>
         <Head>
            <title>Posts</title>
         </Head>
         <main className={style.mainContainer}>
            <div className={style.posts}>
               {posts.map((post) => (
                  <Link href={`/posts/${post.slug}`} key={post.slug}>
                     <a>
                        <time>{post.updateDate}</time>
                        <strong>{post.title}</strong>
                        <p>{post.excerpt}</p>
                     </a>
                  </Link>
               ))}
            </div>
         </main>
      </>
   );
}

export const getStaticProps: GetStaticProps = async () => {
   const prismic = getPrismicApi();
   const response = await prismic.query(
      [Prismic.predicates.at("document.type", "post")],
      { fetch: ["post.title", "post.content"], pageSize: 100 } //Quantidade de itens
   );
   const posts = response.results.map((post) => {
      return {
         slug: post.uid,
         title: RichText.asText(post.data.title),
         // Filtra pegando a partir do 1° pragrafo, evitando vir imagem de inicio se tiver
         excerpt:
            post.data.content.find((content) => content.type === "paragraph")
               ?.text ?? "",

         updateDate: new Date(post.last_publication_date).toLocaleDateString(
            "pt-BR",
            {
               day: "2-digit",
               month: "long",
               year: "numeric",
            }
         ),
      };
   });
   return {
      props: { posts },
   };
};
