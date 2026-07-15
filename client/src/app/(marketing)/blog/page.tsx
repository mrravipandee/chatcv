import { Metadata } from "next";
import { getAllPosts, getCategories, getTags } from "@/lib/blog";
import BlogListingClient from "@/components/blog/BlogListingClient";

export const metadata: Metadata = {
  title: "ChatCV Career Blog - AI Resume & Interview Advice",
  description: "Learn how to optimize your resume for Applicant Tracking Systems (ATS), write cover letters, pass technical job interviews, and build premium LaTeX resumes.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "ChatCV Career Blog - AI Resume & Interview Advice",
    description: "Expert advice on resume keyword optimization, beat applicant tracking systems, ATS guides, and modern career acceleration strategies.",
    url: "https://resume-builder-chatcv.vercel.app/blog",
    type: "website",
  },
};

export default function BlogListingPage() {
  const posts = getAllPosts();
  const categories = getCategories();
  const tags = getTags();

  return (
    <main className="bg-black min-h-screen">
      <BlogListingClient 
        initialPosts={posts} 
        categories={categories} 
        tags={tags} 
      />
    </main>
  );
}
