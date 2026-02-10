import { Request, Response } from "express";
import Folder from "../schema/folder.schema";
import Snippet from "../schema/snippet.schema";
import { getUserId, getParamId } from "../../common/helper/request.helper";
import { catchError } from "../../common/middleware/catch-error.middleware";

export const createFolder = catchError(async (req: Request, res: Response) => {
  const { name } = req.body;

  const folder = await Folder.create({
    name,
    user: req.user!._id,
  });

  res.status(201).json(folder);
});

export const moveSnippetToFolder = catchError(async (req: Request, res: Response) => {
  const { snippetId, folderId } = req.body;

  const snippet = await Snippet.findByIdAndUpdate(
    snippetId,
    { folder: folderId },
    { new: true }
  );

  res.json(snippet);
});

export const deleteFolder = catchError(async (req: Request, res: Response) => {
  const folder = await Folder.findById(getParamId(req));

  if (!folder) {
    res.status(404);
    throw new Error("Folder not found");
  }

  if (folder.user.toString() !== req.user!._id) {
    res.status(403);
    throw new Error("Unauthorized");
  }

  await Folder.findByIdAndDelete(getParamId(req));

  res.json({ message: "Folder deleted successfully" });
});

export const getFolders = catchError(async (req: Request, res: Response) => {
  const folders = await Folder.find({
    user: req.user!._id,
  });

  res.json(folders);
});


