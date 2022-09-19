/* eslint-disable @typescript-eslint/no-unused-vars */
import { Author, Post } from '@prisma/client';
export const filterAuthor = (author: Author) => {
  const { password, id, createdAt, updatedAt, ...rest } = author;
  return rest;
};

export const filterAuthorFromPost = (post: any) => {
  const { author, ...rest } = post;
  const newAuthor = filterAuthor(author);
  return {
    author: newAuthor,
    ...rest,
  };
};

export const filterAuthorFromPosts = (posts: Post[]) => {
  return posts.map((post: any) => {
    return filterAuthorFromPost(post);
  });
};
