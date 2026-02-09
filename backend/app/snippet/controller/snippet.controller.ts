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
import { asyncHandler, handleError } from "../../common/utils/error.handler";
import { getUserId, getUserIdOptional, getParamId } from "../../common/helper/request.helper";

export const createSnippet = asyncHandler(async (req: Request, res: Response) => {
  const snippet = await createSnippetService({
    ...req.body,
    author: req.user!._id,
  });

  res.status(201).json(snippet);
}, (res, error) => handleError(res, error, "Failed to create snippet"));

export const getAllSnippets = asyncHandler(async (req: Request, res: Response) => {
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
}, (res, error) => handleError(res, error, "Failed to fetch snippets"));

export const getSnippetById = asyncHandler(async (req: Request, res: Response) => {
  const snippet = await getSnippetByIdService(
    getParamId(req),
    getUserIdOptional(req)
  );

  res.json(snippet);
}, (res, error) => handleError(res, error, "Access denied", 403));

export const getPublicSnippet = asyncHandler(async (req: Request, res: Response) => {
  const snippet = await Snippet.findById(getParamId(req));

  if (!snippet) {
    return res.status(404).json({ message: "Not found" });
  }

  if (snippet.visibility !== "public") {
    return res.status(403).json({ message: "Private snippet" });
  }

  res.json(snippet);
});

export const updateSnippet = asyncHandler(async (req: Request, res: Response) => {
  const snippet = await updateSnippetService(
    getParamId(req),
    getUserId(req),
    req.body
  );
  res.json(snippet);
}, (res, error) => handleError(res, error, "Access denied", 403));

export const restoreSnippetVersion = asyncHandler(async (req: Request, res: Response) => {
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
}, (res, error) => handleError(res, error, "Restore failed"));

export const getSnippetHistory = asyncHandler(async (req: Request, res: Response) => {
  const history = await SnippetVersion.find({
    snippet: getParamId(req),
  }).sort({ editedAt: -1 });

  res.json(history);
});

export const getSnippetsByFolder = asyncHandler(async (req: Request, res: Response) => {
  const snippets = await getSnippetsByFolderService(
    getParamId(req, "folderId"),
    getUserId(req)
  );

  res.json(snippets);
}, (res, error) => handleError(res, error, "Failed to fetch folder snippets"));

export const moveSnippetToFolder = asyncHandler(async (req: Request, res: Response) => {
  const { folderId } = req.body;

  const snippet = await Snippet.findByIdAndUpdate(
    getParamId(req),
    { folder: folderId },
    { new: true }
  );

  res.json(snippet);
});

export const forkSnippet = asyncHandler(async (req: Request, res: Response) => {
  const originalSnippetId = getParamId(req);

  const forked = await forkSnippetService(
    originalSnippetId,
    getUserId(req)
  );

  await incrementForkCountService(originalSnippetId);

  res.status(201).json(forked);
}, (res, error) => handleError(res, error, "Operation failed"));

export const deleteSnippet = asyncHandler(async (req: Request, res: Response) => {
  await deleteSnippetService(getParamId(req), getUserIdOptional(req));

  res.json({ message: "Snippet deleted" });
}, (res, error) => handleError(res, error, "Not allowed to delete this snippet", 403));

