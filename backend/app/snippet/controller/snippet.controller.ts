import { Request, Response } from "express";
import {
  createSnippetService,
  getAllSnippetsService,
  getSnippetByIdService,
  updateSnippetService,
  deleteSnippetService,
  forkSnippetService,
  getSnippetsByFolderService,
} from "../services/snippet.service";

import Snippet from "../schema/snippet.schema";
import SnippetVersion from "../schema/snippetVersion.schema";
import { incrementForkCountService } from "../services/analytics.service";

export const createSnippet = async (req: Request, res: Response) => {
  try {
    const snippet = await createSnippetService({
      ...req.body,
      author: req.user!._id,
    });

    res.status(201).json(snippet);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: err.message || "Failed to create snippet" });
  }
};

export const getAllSnippets = async (req: Request, res: Response) => {
  try {
    const {
      tag,
      language,
      author,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 6
    } = req.query;

    const data = await getAllSnippetsService(
      req.user?._id,
      tag as string,
      language as string,
      author as string,
      startDate as string,
      endDate as string,
      search as string,
      (req.query.teamId as string),
      Number(page),
      Number(limit)
    );

    res.json(data);
  } catch (error: unknown) {
    res.status(500).json({ message: "Failed to fetch snippets" });
  }
};

export const getSnippetById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const snippet = await getSnippetByIdService(
      id,
      req.user?._id
    );

    res.json(snippet);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(403).json({ message: err.message });
  }
};

export const getPublicSnippet = async (req: Request, res: Response) => {
  const snippet = await Snippet.findById(req.params.id);

  if (!snippet) {
    return res.status(404).json({ message: "Not found" });
  }

  if (snippet.visibility !== "public") {
    return res.status(403).json({ message: "Private snippet" });
  }

  res.json(snippet);
};

export const updateSnippet = async (req: Request, res: Response) => {
  try {
    const snippet = await updateSnippetService(
      req.params.id as string,
      req.user!._id,
      req.body
    );
    res.json(snippet);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(403).json({ message: err.message });
  }
};

export const restoreSnippetVersion = async (req: Request, res: Response) => {
  try {
    const { versionId } = req.params;

    const version = await SnippetVersion.findById(versionId);

    if (!version)
      return res.status(404).json({ message: "Version not found" });

    const updated = await Snippet.findByIdAndUpdate(
      version.snippet,
      {
        title: version.title,
        code: version.code,
        language: version.language,
        tags: version.tags,
        visibility: version.visibility,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Restore failed" });
  }
};

export const getSnippetHistory = async (req: Request, res: Response) => {
  const history = await SnippetVersion.find({
    snippet: req.params.id,
  }).sort({ editedAt: -1 });

  res.json(history);
};

export const getSnippetsByFolder = async (req: Request, res: Response) => {
  try {
    const snippets = await getSnippetsByFolderService(
      req.params.folderId as string,
      req.user!._id
    );

    res.json(snippets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch folder snippets" });
  }
};

export const moveSnippetToFolder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { folderId } = req.body;

  const snippet = await Snippet.findByIdAndUpdate(
    id,
    { folder: folderId },
    { new: true }
  );

  res.json(snippet);
};

export const forkSnippet = async (req: Request, res: Response) => {
  try {
    const originalSnippetId = req.params.id as string;

    const forked = await forkSnippetService(
      originalSnippetId,
      req.user!._id
    );

    await incrementForkCountService(originalSnippetId);

    res.status(201).json(forked);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const deleteSnippet = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    await deleteSnippetService(req.params.id as string, userId);

    res.json({ message: "Snippet deleted" });
  } catch (error) {
    res.status(403).json({ message: "Not allowed to delete this snippet" });
  }
};
