import Image from "next/image";
import localFont from "next/font/local";
import SocialMediaApp from "@/components-1/new-ui";
import { fetchPosts } from "@/hooks/useFetchPosts";
import { Post } from "@/lib/process";
import { Toaster } from "@/components-1/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home({ _posts }: { _posts?: Post[] }) {
  return (
    <div className="mx-auto ">
      <SocialMediaApp _posts={_posts} />
      <Toaster />
    </div>
  );
}

export async function getStaticProps(params: { params: { id: string } }) {
  const posts = await fetchPosts();
  return { props: { _posts: posts ?? [] } };
}
