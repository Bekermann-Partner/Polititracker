import { User, Comment } from '@prisma/client';

/** Custom Type for Comments with nested data (includes the comment, it's author and list of replies)*/
export interface CommentWithNestedReplies extends Comment {
  user: User;
  replies: CommentWithNestedReplies[];
}
