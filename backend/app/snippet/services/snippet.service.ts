import Snippet, { ISnippet } from "../schema/snippet.schema";
import SnippetVersion from "../schema/snippetVersion.schema";
import Team, { ITeam } from "../../team/schema/team.schema";
import mongoose from "mongoose";

type FilterQuery<T> = { [P in keyof T]?: any } & Record<string, any>;

export interface CreateSnippetData {
  title: string;
  code: string;
  language: string;
  tags?: string[];
  visibility?: "public" | "private" | "team";
  folder?: string | null;
  team?: string | null;
  author: string;
}

export const createSnippetService = async (data: CreateSnippetData) => {
  if (data.team) {
    const team = await Team.findById(data.team);
    if (!team) throw new Error("Team not found");

    const userId = data.author;
    const isOwner = team.owner.toString() === userId.toString();
    const isMember = team.members.some(m => m.user.toString() === userId.toString());

    if (!isOwner && !isMember) {
      throw new Error("User is not a member of this team");
    }

    if (!data.visibility) data.visibility = "team";
  }

  const snippetData: Partial<ISnippet> = {
    ...data,
    author: new mongoose.Types.ObjectId(data.author),
    team: data.team ? new mongoose.Types.ObjectId(data.team) : undefined,
    folder: data.folder ? new mongoose.Types.ObjectId(data.folder) : undefined,
  };

  return await Snippet.create(snippetData);
};

export const getAllSnippetsService = async (
  userId?: string,
  tag?: string,
  language?: string,
  author?: string,
  startDate?: string,
  endDate?: string,
  search?: string,
  teamId?: string,
  page: number = 1,
  limit: number = 6
) => {
  const query: FilterQuery<ISnippet> = {};

  if (teamId) {
    query.team = new mongoose.Types.ObjectId(teamId);
    if (!userId) throw new Error("Authentication required for team snippets");
  } else {
    query.team = null;
    if (userId) {
      query.$or = [{ visibility: "public" }, { author: new mongoose.Types.ObjectId(userId) }];
    } else {
      query.visibility = "public";
    }
  }

  if (tag) query.tags = tag;
  if (language) query.language = language;

  if (author) {
    query.author = new mongoose.Types.ObjectId(author);
  }

  if (startDate || endDate) {
    const dateQuery: { $gte?: Date; $lte?: Date } = {};
    if (startDate) dateQuery.$gte = new Date(startDate);
    if (endDate) dateQuery.$lte = new Date(endDate);
    query.createdAt = dateQuery;
  }

  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    const searchCondition = {
      $or: [
        { title: searchRegex },
        { code: searchRegex },
        { language: searchRegex },
        { tags: searchRegex }
      ]
    };

    if (query.$or) {
      query.$and = [
        { $or: query.$or },
        searchCondition
      ];
      delete query.$or;
    } else {
      Object.assign(query, searchCondition);
    }
  }

  const skip = (page - 1) * limit;

  const snippets = await Snippet.find(query)
    .populate("author", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Snippet.countDocuments(query);

  return {
    snippets,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const getSnippetByIdService = async (
  id: string,
  userId?: string
) => {
  const snippet = await Snippet.findById(id)
    .populate("author", "name email")
    .populate("team");

  if (!snippet) {
    throw new Error("Snippet not found");
  }

  if (snippet.team) {
    if (!userId) throw new Error("Unauthorized");
    // Team is populated, so snippet.team is ITeam
    const team = snippet.team as unknown as ITeam;
    const isOwner = team.owner.toString() === userId;
    const isMember = team.members.some((m) => m.user.toString() === userId);

    if (!isOwner && !isMember && snippet.visibility !== "public") {
      throw new Error("Unauthorized access to team snippet");
    }

  } else {
    if (
      snippet.visibility === "private" &&
      snippet.author._id.toString() !== userId
    ) {
      throw new Error("Unauthorized");
    }
  }

  return snippet;
};

export const updateSnippetService = async (
  id: string,
  userId: string,
  data: Partial<CreateSnippetData>
) => {
  const snippet = (await Snippet.findById(id)) as ISnippet;

  if (!snippet) throw new Error("Snippet not found");

  if (snippet.author.toString() !== userId)
    throw new Error("Unauthorized");

  await SnippetVersion.create({
    snippet: snippet._id,
    title: snippet.title,
    code: snippet.code,
    language: snippet.language,
    tags: snippet.tags,
    visibility: snippet.visibility,
    editedAt: new Date(),
  });

  return await Snippet.findByIdAndUpdate(id, data, { new: true });
};

export const getSnippetsByFolderService = async (
  folderId: string,
  userId: string
) => {
  return await Snippet.find({
    folder: new mongoose.Types.ObjectId(folderId),
    $or: [{ visibility: "public" }, { author: new mongoose.Types.ObjectId(userId) }],
  })
    .populate("author", "name email")
    .sort({ createdAt: -1 });
};

export const forkSnippetService = async (
  snippetId: string,
  userId: string
) => {
  const original = await Snippet.findById(snippetId);
  if (!original) throw new Error("Snippet not found");

  const forkTitle = original.title.includes("(fork)")
    ? original.title
    : `${original.title} (fork)`;

  return await Snippet.create({
    title: forkTitle,
    code: original.code,
    language: original.language,
    tags: original.tags,
    visibility: "private",
    author: new mongoose.Types.ObjectId(userId),
  });
};

export const deleteSnippetService = async (
  id: string,
  userId?: string
) => {
  const snippet = await Snippet.findById(id);
  if (!snippet) throw new Error("Snippet not found");

  if (snippet.author.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  return await Snippet.findByIdAndDelete(id);
};
