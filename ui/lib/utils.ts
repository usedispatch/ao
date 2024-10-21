import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string) {
  return address.length > 10
    ? `${address.substring(0, 7)}...${address.slice(-3)}`
    : address;
}

export function sharePost(postId: string) {
  const url = `${window.location.origin}/post/${postId}`;

  navigator.clipboard.writeText(url).then(() => {
    alert('Link copied to clipboard!');
  }, (err) => {
    console.error('Could not copy text: ', err);
  });
  
}

export const createThreadedPosts = (flatPosts: any[]) => {
  const postMap = new Map();
  const rootPosts: any[] = [];

  flatPosts.forEach((post: { Replies: never[]; Id: any; }) => {
    post.Replies = [];
    postMap.set(post.Id, post);
  });

  flatPosts.forEach((post: { ParentId: any; }) => {
    if (post.ParentId) {
      const parent = postMap.get(post.ParentId);
      if (parent) {
        parent.Replies.push(post);
      }
    } else {
      rootPosts.push(post);
    }
  });

  return rootPosts.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());
};