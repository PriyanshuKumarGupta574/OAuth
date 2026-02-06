import Snippet, { ISnippet } from "../schema/snippet.schema";
import SnippetVersion from "../schema/snippetVersion.schema";


import Team from "../../team/schema/team.schema";

export const createSnippetService = async (data: any) => {
  // If creating for a team, verify membership
  if (data.team) {
    const team = await Team.findById(data.team);
    if (!team) throw new Error("Team not found");

    const userId = data.author;
    const isOwner = team.owner.toString() === userId.toString();
    const isMember = team.members.some(m => m.user.toString() === userId.toString());

    if (!isOwner && !isMember) {
      throw new Error("User is not a member of this team");
    }

    // Enforce team visibility? Or allow "private" team snippets? 
    // For now, let user decide, but maybe default to "team" visibility?
    if (!data.visibility) data.visibility = "team";
  }

  return await Snippet.create(data);
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
  const query: any = {};

  if (teamId) {
    query.team = teamId;
    if (!userId) throw new Error("Authentication required for team snippets");
  } else {
    query.team = null;
    if (userId) {
      query.$or = [{ visibility: "public" }, { author: userId }];
    } else {
      query.visibility = "public";
    }
  }

  if (tag) query.tags = tag;
  if (language) query.language = language;

  if (author) {
    query.author = author;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    // We need to be careful not to overwrite the existing $or for visibility
    // So we use $and to combine visibility check with search check
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

  // If snippet belongs to a team, check if user is a member
  if (snippet.team) {
    if (!userId) throw new Error("Unauthorized");
    // Just simple check if user is in team members
    // We need to fetch team members or trust query?
    // Let's rely on the populated team object if it has members
    // But schema ref might not fully populate members depending on Team schema def in snippet service? 
    // Wait, Snippet schema ref "Team".
    // We need to check if userId is in (snippet.team as any).members or owner

    // NOTE: This relies on full population which might be heavy. 
    // Alternatively, just return it and let frontend handle? No, security.

    // Better: use Team model to check membership
    // avoiding circular dependency might be tricky if not careful? 
    // Actually simpler: 
    const isOwner = (snippet.team as any).owner.toString() === userId;
    const isMember = (snippet.team as any).members.some((m: any) => m.user.toString() === userId);

    if (!isOwner && !isMember && snippet.visibility !== "public") {
      throw new Error("Unauthorized access to team snippet");
    }

  } else {
    // Personal snippet logic
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
  data: any
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
    folder: folderId,
    $or: [{ visibility: "public" }, { author: userId }],
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
    author: userId,
  });
};


export const deleteSnippetService = async (
  id: string,
  userId?: string
) => {
  const snippet = await Snippet.findById(id);

  if (!snippet) {
    throw new Error("Snippet not found");
  }

  if (snippet.author.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  return await Snippet.findByIdAndDelete(id);
};













