import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useDroppable } from "@dnd-kit/core";
import {
  getFolders,
  moveSnippetToFolder,
  deleteFolder,
} from "../services/folder.service";

type Folder = {
  _id: string;
  name: string;
};


function DroppableFolder({
  folder,
  onDelete,
}: {
  folder: Folder;
  onDelete: (id: string) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: folder._id,
  });

  return (
    <div ref={setNodeRef}>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton
            edge="end"
            onClick={() => onDelete(folder._id)}
          >
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemButton>
          <ListItemText primary={folder.name} />
        </ListItemButton>
      </ListItem>
    </div>
  );
}


export default function FolderSidebar() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    const res = await getFolders();
    setFolders(res.data);
  };

  const handleDelete = async (folderId: string) => {
    const ok = window.confirm(
      "Are you sure? Snippets inside will be unassigned."
    );
    if (!ok) return;

    await deleteFolder(folderId);
    loadFolders();
  };

  return (
    <Box sx={{ width: 250, borderRight: "1px solid #eee", p: 2 }}>
      <Typography variant="h6" mb={2}>
        📁 Folders
      </Typography>

      <Button
        variant="contained"
        fullWidth
        sx={{ mb: 2 }}
        onClick={() => navigate("/dashboard/folders/create")}
      >
        + New Folder
      </Button>

      <List>
        {folders.map((folder) => (
          <DroppableFolder
            key={folder._id}
            folder={folder}
            onDelete={handleDelete}
          />
        ))}
      </List>
    </Box>
  );
}




