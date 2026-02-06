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
  Collapse,
  ListItemIcon,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useNavigate, useParams } from "react-router-dom";
import { useDroppable } from "@dnd-kit/core";
import {
  getFolders,
  deleteFolder,
  getFolderWithSnippets,
} from "../services/folder.service";
import { getSnippets } from "../services/snippet.service";

type Snippet = {
  _id: string;
  title: string;
  language: string;
};

type Folder = {
  _id: string;
  name: string;
  snippets?: Snippet[];
  isExpanded?: boolean;
};

// Language icon mapping
const getLanguageIcon = (language: string) => {
  const icons: Record<string, string> = {
    javascript: "📜",
    typescript: "📘",
    python: "🐍",
    java: "☕",
    cpp: "⚙️",
    csharp: "🔷",
    go: "🔷",
    rust: "🦀",
    php: "🐘",
  };
  return icons[language.toLowerCase()] || "📄";
};

function DroppableFolder({
  folder,
  onDelete,
  onToggle,
  onSnippetClick,
  activeSnippetId,
}: {
  folder: Folder;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onSnippetClick: (snippetId: string) => void;
  activeSnippetId?: string;
}) {
  const { setNodeRef } = useDroppable({
    id: folder._id,
  });

  return (
    <div ref={setNodeRef}>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton edge="end" onClick={() => onDelete(folder._id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        }
      >
        <ListItemButton onClick={() => onToggle(folder._id)} dense>
          <ListItemIcon sx={{ minWidth: 32 }}>
            {folder.isExpanded ? (
              <ExpandMoreIcon fontSize="small" />
            ) : (
              <ChevronRightIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemIcon sx={{ minWidth: 32 }}>
            {folder.isExpanded ? (
              <FolderOpenIcon fontSize="small" color="primary" />
            ) : (
              <FolderIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={folder.name}
            primaryTypographyProps={{ fontSize: 14 }}
          />
        </ListItemButton>
      </ListItem>

      <Collapse in={folder.isExpanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {folder.snippets && folder.snippets.length > 0 ? (
            folder.snippets.map((snippet) => (
              <ListItem
                key={snippet._id}
                disablePadding
                sx={{ pl: 6 }}
              >
                <ListItemButton
                  dense
                  onClick={() => onSnippetClick(snippet._id)}
                  selected={activeSnippetId === snippet._id}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "primary.light",
                      "&:hover": {
                        backgroundColor: "primary.light",
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <span>{getLanguageIcon(snippet.language)}</span>
                        <span style={{ fontSize: 13 }}>{snippet.title}</span>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem sx={{ pl: 6 }}>
              <ListItemText
                primary="No snippets"
                primaryTypographyProps={{
                  fontSize: 12,
                  color: "text.secondary",
                  fontStyle: "italic",
                }}
              />
            </ListItem>
          )}
        </List>
      </Collapse>
    </div>
  );
}

export default function FolderSidebar() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [unassignedSnippets, setUnassignedSnippets] = useState<Snippet[]>([]);
  const [showUnassigned, setShowUnassigned] = useState(true);
  const navigate = useNavigate();
  const { id: activeSnippetId } = useParams();

  useEffect(() => {
    loadFolders();
    loadUnassignedSnippets();
  }, []);

  const loadFolders = async () => {
    const res = await getFolders();
    const foldersData = res.data;

    // Load snippets for each folder
    const foldersWithSnippets = await Promise.all(
      foldersData.map(async (folder: Folder) => {
        try {
          const snippetsRes = await getFolderWithSnippets(folder._id);
          return {
            ...folder,
            snippets: snippetsRes.data,
            isExpanded: false,
          };
        } catch (error) {
          return { ...folder, snippets: [], isExpanded: false };
        }
      })
    );

    setFolders(foldersWithSnippets);
  };

  const loadUnassignedSnippets = async () => {
    try {
      const res = await getSnippets();
      // Filter snippets without folder
      const unassigned = res.data.snippets.filter(
        (s: any) => !s.folder || s.folder === null
      );
      setUnassignedSnippets(unassigned);
    } catch (error) {
      console.error("Failed to load unassigned snippets:", error);
    }
  };

  const handleDelete = async (folderId: string) => {
    const ok = window.confirm(
      "Are you sure? Snippets inside will be unassigned."
    );
    if (!ok) return;

    await deleteFolder(folderId);
    loadFolders();
    loadUnassignedSnippets();
  };

  const handleToggle = (folderId: string) => {
    setFolders((prev) =>
      prev.map((f) =>
        f._id === folderId ? { ...f, isExpanded: !f.isExpanded } : f
      )
    );
  };

  const handleSnippetClick = (snippetId: string) => {
    navigate(`/dashboard/snippets/${snippetId}`);
  };

  return (
    <Box sx={{ width: 280, borderRight: "1px solid #e0e0e0", p: 2, height: "100vh", overflow: "auto" }}>

      {/* Analytics Section */}
      <List dense sx={{ mb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/dashboard/analytics")}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <span style={{ fontSize: "1.2rem" }}>📊</span>
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/dashboard/trending")}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <span style={{ fontSize: "1.2rem" }}>🔥</span>
            </ListItemIcon>
            <ListItemText primary="Trending" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/dashboard/teams")}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <span style={{ fontSize: "1.2rem" }}>👥</span>
            </ListItemIcon>
            <ListItemText primary="Teams" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => window.location.href = "http://localhost:5000/api/auth/github"}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <GitHubIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Connect GitHub" />
          </ListItemButton>
        </ListItem>
      </List>

      <Typography variant="h6" mb={2} sx={{ fontSize: 16, fontWeight: 600 }}>
        📁 Explorer
      </Typography>

      <Button
        variant="contained"
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        onClick={() => navigate("/dashboard/folders/create")}
      >
        + New Folder
      </Button>

      <List dense>
        {folders.map((folder) => (
          <DroppableFolder
            key={folder._id}
            folder={folder}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onSnippetClick={handleSnippetClick}
            activeSnippetId={activeSnippetId}
          />
        ))}

        {/* Unassigned Snippets Section */}
        <ListItem disablePadding sx={{ mt: 2 }}>
          <ListItemButton onClick={() => setShowUnassigned(!showUnassigned)} dense>
            <ListItemIcon sx={{ minWidth: 32 }}>
              {showUnassigned ? (
                <ExpandMoreIcon fontSize="small" />
              ) : (
                <ChevronRightIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <FolderOpenIcon fontSize="small" color="action" />
            </ListItemIcon>
            <ListItemText
              primary="Unassigned"
              primaryTypographyProps={{ fontSize: 14, color: "text.secondary" }}
            />
          </ListItemButton>
        </ListItem>

        <Collapse in={showUnassigned} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {unassignedSnippets.length > 0 ? (
              unassignedSnippets.map((snippet) => (
                <ListItem key={snippet._id} disablePadding sx={{ pl: 6 }}>
                  <ListItemButton
                    dense
                    onClick={() => handleSnippetClick(snippet._id)}
                    selected={activeSnippetId === snippet._id}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "primary.light",
                        "&:hover": {
                          backgroundColor: "primary.light",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <span>{getLanguageIcon(snippet.language)}</span>
                          <span style={{ fontSize: 13 }}>{snippet.title}</span>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem sx={{ pl: 6 }}>
                <ListItemText
                  primary="No unassigned snippets"
                  primaryTypographyProps={{
                    fontSize: 12,
                    color: "text.secondary",
                    fontStyle: "italic",
                  }}
                />
              </ListItem>
            )}
          </List>
        </Collapse>
      </List>
    </Box>
  );
}





