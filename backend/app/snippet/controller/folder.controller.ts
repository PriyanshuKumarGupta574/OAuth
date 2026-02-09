import { Request, Response } from "express";
import Folder from "../schema/folder.schema";
import Snippet from "../schema/snippet.schema";
import { asyncHandler, handleError } from "../../common/utils/error.handler";
import { getUserId, getParamId } from "../../common/helper/request.helper";

export const createFolder = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  const folder = await Folder.create({
    name,
    user: req.user!._id,
  });

  res.status(201).json(folder);
}, (res, error) => handleError(res, error, "Failed to create folder"));

export const moveSnippetToFolder = asyncHandler(async (req: Request, res: Response) => {
  const { snippetId, folderId } = req.body;

  const snippet = await Snippet.findByIdAndUpdate(
    snippetId,
    { folder: folderId },
    { new: true }
  );

  res.json(snippet);
}, (res, error) => handleError(res, error, "Failed to move snippet"));

export const deleteFolder = asyncHandler(async (req: Request, res: Response) => {
  const folder = await Folder.findById(getParamId(req));

  if (!folder) {
    return res.status(404).json({ message: "Folder not found" });
  }

  if (folder.user.toString() !== req.user!._id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await Folder.findByIdAndDelete(getParamId(req));

  res.json({ message: "Folder deleted successfully" });
}, (res, error) => handleError(res, error, "Delete folder failed"));

export const getFolders = asyncHandler(async (req: Request, res: Response) => {
  const folders = await Folder.find({
    user: req.user!._id,
  });

  res.json(folders);
}, (res, error) => handleError(res, error, "Failed to fetch folders"));

