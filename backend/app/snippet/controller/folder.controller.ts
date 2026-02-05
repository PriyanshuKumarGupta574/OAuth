import { Request, Response } from "express";
import Folder from "../schema/folder.schema";
import Snippet from "../schema/snippet.schema";


export const createFolder = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const folder = await Folder.create({
      name,
      user: (req as any).user._id,
    });

    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ message: "Failed to create folder" });
  }
};

export const moveSnippetToFolder = async  (req: Request, res: Response) => {
  const { snippetId, folderId } = req.body;

  const snippet = await Snippet.findByIdAndUpdate(
    snippetId,
    { folder: folderId },
    { new: true }
  );

  res.json(snippet);
};

export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const folder = await Folder.findById(id);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // security — only owner can delete
    if (folder.user.toString() !== (req as any).user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Folder.findByIdAndDelete(id);

    res.json({ message: "Folder deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete folder failed" });
  }
};


export const getFolders = async (req: Request, res: Response) => {
  const folders = await Folder.find({
    user: (req as any).user._id,
  });

  res.json(folders);
};


// import { Request, Response } from "express";
// import Folder from "../schema/folder.schema";

// // create folder
// export const createFolder = async (req: Request, res: Response) => {
//   try {
//     const folder = await Folder.create({
//       name: req.body.name,
//       user: (req as any).user._id,
//     });

//     res.status(201).json(folder);
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // get user folders
// export const getFolders = async (req: Request, res: Response) => {
//   try {
//     const folders = await Folder.find({
//       user: (req as any).user._id,
//     }).sort({ createdAt: -1 });

//     res.json(folders);
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };
