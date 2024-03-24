import { Prisma } from "@prisma/client";
import { UserId } from "@domain/user";
import { CategoryType, CategoryId } from "@domain/category";
import { IssueId, Issue } from "@domain/issue";
import { Priority, PriorityId } from "@domain/priority";
import { Comment } from "@domain/comment";
import { dnull } from "src/utils/dnull";
import { db } from "./db.server";

export const getIssue = async (issueId: IssueId): Promise<Issue | null> => {
  const issueDb = await db.issue.findUnique({
    where: {
      id: issueId,
    },
    include: {
      asignee: true,
      reporter: true,
      category: true,
      priority: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!issueDb) {
    return null;
  }

  const issue: Issue = {
    id: issueDb.id,
    name: issueDb.name,
    description: issueDb.description || undefined,
    categoryType: issueDb.category.type as CategoryType,
    priority: issueDb.priority as Priority,
    asignee: dnull(issueDb.asignee),
    reporter: dnull(issueDb.reporter),
    comments: issueDb.comments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.getTime(),
      updatedAt: comment.updatedAt.getTime(),
      user: dnull({
        ...comment.user,
        createdAt: comment.user.createdAt.getTime(),
        updatedAt: comment.user.updatedAt.getTime(),
      }),
    })),
    createdAt: issueDb.createdAt.getTime(),
    updatedAt: issueDb.updatedAt.getTime(),
  };

  return issue;
};

export type CreateIssueInputData = {
  name: string;
  description: string;
  categoryId: CategoryId;
  priority: PriorityId;
  asigneeId: UserId;
  reporterId: UserId;
  comments: Comment[];
};
export const createIssue = async (issue: CreateIssueInputData): Promise<IssueId> => {
  const newIssue = await db.issue.create({
    data: {
      ...issue,
      priority: undefined,
      priorityId: issue.priority,
      comments: {
        create: issue.comments.map((comment) => {
          const commentInput: Omit<Prisma.CommentCreateInput, "issue"> = {
            id: comment.id,
            message: comment.message,
            user: { connect: { id: comment.user.id } },
          };

          return {
            ...commentInput,
            id: undefined,
          };
        }),
      },
    },
  });

  return newIssue.id as IssueId;
};

export type UpdateIssueInputData = CreateIssueInputData & { id: IssueId };
export const updateIssue = async (issue: UpdateIssueInputData) => {
  await db.issue.update({
    where: {
      id: issue.id,
    },
    data: {
      ...issue,
      priority: undefined,
      priorityId: issue.priority,
      comments: {
        upsert: issue.comments.map((comment) => {
          const commentInput: Omit<Prisma.CommentCreateInput, "issue"> = {
            id: comment.id,
            message: comment.message,
            user: { connect: { id: comment.user.id } },
          };

          return {
            where: { id: comment.id },
            create: {
              ...commentInput,
              id: undefined,
            },
            update: commentInput,
          };
        }),
      },
    },
  });
};

export type UpdateIssueCategoryData = {
  issueId: IssueId;
  categoryId: CategoryId;
};
export const updateIssueCategory = async ({ issueId, categoryId }: UpdateIssueCategoryData) => {
  await db.issue.update({
    where: {
      id: issueId,
    },
    data: {
      category: {
        connect: {
          id: categoryId,
        },
      },
    },
  });
};

export const deleteIssue = async (issueId: IssueId) => {
  await db.issue.delete({
    where: {
      id: issueId,
    },
  });
};
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();
const genAI = new GoogleGenerativeAI("AIzaSyDNrAFs_n3Us2J_GGypZkIl1eDJ3HIhK5w");



export const createIssueusingAI = async (query:String): Promise<IssueId> => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  console.log(process.env.API_KEY);

  const prompt = "I want to create jira issue for below problem " + query + `  export type CreateIssueInputData = {
    name: string;
    description: string;
    categoryId: CategoryId;
    priority: PriorityId;
    asigneeId: UserId;
    reporterId: UserId;
    comments: Comment[];
  };
  remember - priority should be either "low", "medium" or "high"
  this is my schema, fill the details professionally according to agile project standards and return ONLY the issue object in string form in which keys and values are enclosed in double quotes according to above schema
  `
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const trimmedString = text.substring(
    text.indexOf('{') + 1,
    text.lastIndexOf('}')
  );
  const finalString = "{" + trimmedString + "}";
  // const jsonString = finalString.replace(/'/g, '"');
  const jsonObject = JSON.parse(finalString);
  jsonObject.asigneeId = "114020ad-5bc4-4ebe-a7cf-8ea78b338a73";
  jsonObject.reporterId = "759af9f6-2ffb-45d2-9c0a-be751185f286";
  jsonObject.categoryId = "1e8877a7-91dc-46de-bce0-f077ad922fc8";
  await createIssue(jsonObject);
  console.log(jsonObject);
  
  return text;
} 