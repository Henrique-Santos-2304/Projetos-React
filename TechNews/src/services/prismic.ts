import Prismic from "@prismicio/client";

export function getPrismicApi(req?: unknown) {
   const prismic = Prismic.client(process.env.PRISMIC_API_URL, {
      req,
      accessToken: process.env.PRISMIC_API_TOKEN,
   });
   return prismic;
}
