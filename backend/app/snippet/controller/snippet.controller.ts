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
import { getUserId, getUserIdOptional, getParamId } from "../../common/helper/request.helper";
import { catchError } from "../../common/middleware/catch-error.middleware";

export const createSnippet = catchError(async (req: Request, res: Response) => {
  const snippet = await createSnippetService({
    ...req.body,
    author: req.user!._id,
  });

  res.status(201).json(snippet);
});

export const getAllSnippets = catchError(async (req: Request, res: Response) => {
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
    getUserIdOptional(req),
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
});

export const getSnippetById = catchError(async (req: Request, res: Response) => {
  const snippet = await getSnippetByIdService(
    getParamId(req),
    getUserIdOptional(req)
  );

  res.json(snippet);
});

export const getPublicSnippet = catchError(async (req: Request, res: Response) => {
  const snippet = await Snippet.findById(getParamId(req));

  if (!snippet) {
    res.status(404);
    throw new Error("Not found");
  }

  if (snippet.visibility !== "public") {
    res.status(403);
    throw new Error("Private snippet");
  }

  res.json(snippet);
});

export const updateSnippet = catchError(async (req: Request, res: Response) => {
  const snippet = await updateSnippetService(
    getParamId(req),
    getUserId(req),
    req.body
  );
  res.json(snippet);
});

export const restoreSnippetVersion = catchError(async (req: Request, res: Response) => {
  const { versionId } = req.params;

  const version = await SnippetVersion.findById(versionId);

  if (!version) {
    res.status(404);
    throw new Error("Version not found");
  }

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
});

export const getSnippetHistory = catchError(async (req: Request, res: Response) => {
  const history = await SnippetVersion.find({
    snippet: getParamId(req),
  }).sort({ editedAt: -1 });

  res.json(history);
});

export const getSnippetsByFolder = catchError(async (req: Request, res: Response) => {
  const snippets = await getSnippetsByFolderService(
    getParamId(req, "folderId"),
    getUserId(req)
  );

  res.json(snippets);
});

export const moveSnippetToFolder = catchError(async (req: Request, res: Response) => {
  const { folderId } = req.body;

  const snippet = await Snippet.findByIdAndUpdate(
    getParamId(req),
    { folder: folderId },
    { new: true }
  );

  res.json(snippet);
});

export const forkSnippet = catchError(async (req: Request, res: Response) => {
  const originalSnippetId = getParamId(req);

  const forked = await forkSnippetService(
    originalSnippetId,
    getUserId(req)
  );

  await incrementForkCountService(originalSnippetId);

  res.status(201).json(forked);
});

export const deleteSnippet = catchError(async (req: Request, res: Response) => {
  await deleteSnippetService(getParamId(req), getUserIdOptional(req));

  res.json({ message: "Snippet deleted" });
});


