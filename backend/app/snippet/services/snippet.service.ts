import Snippet, { ISnippet } from "../schema/snippet.schema";
import SnippetVersion from "../schema/snippetVersion.schema";


export const createSnippetService = async (data: any) => {
  return await Snippet.create(data);
};


export const getAllSnippetsService = async (
  userId?: string,
  tag?: string,
  language?: string,
  page: number = 1,
  limit: number = 6
) => {
  const query: any = {
    $or: [{ visibility: "public" }, { author: userId }],
  };


  if (tag) {
    query.tags = { $in: [tag] };
  }

  
  if (language) {
    query.language = language;
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
  const snippet = await Snippet.findById(id).populate(
    "author",
    "name email"
  );

  if (!snippet) {
    throw new Error("Snippet not found");
  }


  if (
    snippet.visibility === "private" &&
    snippet.author._id.toString() !== userId
  ) {
    throw new Error("Unauthorized");
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













