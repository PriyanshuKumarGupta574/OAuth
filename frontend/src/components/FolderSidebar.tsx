import { useEffect, useState } from "react";
import {
  Typography,
  IconButton,
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useNavigate, useParams } from "react-router";
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
  folder?: string | null;
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
      <div className="flex items-center group/folder">
        <div
          onClick={() => onToggle(folder._id)}
          className="flex-1 flex items-center py-2 px-3 hover:bg-slate-50 cursor-pointer rounded-xl transition-colors min-h-[44px]"
        >
          <div className="min-w-[32px] flex items-center text-slate-400">
            {folder.isExpanded ? (
              <ExpandMoreIcon fontSize="small" />
            ) : (
              <ChevronRightIcon fontSize="small" />
            )}
          </div>
          <div className="min-w-[32px] flex items-center">
            {folder.isExpanded ? (
              <FolderOpenIcon fontSize="small" className="text-[#1a73e8]" />
            ) : (
              <FolderIcon fontSize="small" className="text-slate-400" />
            )}
          </div>
          <span className="text-sm font-semibold text-slate-700 truncate">
            {folder.name}
          </span>
        </div>
        <IconButton
          size="small"
          onClick={() => onDelete(folder._id)}
          className="opacity-0 group-hover/folder:opacity-100 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all mr-1"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>

      <Collapse in={folder.isExpanded} timeout="auto" unmountOnExit>
        <div className="pl-6 space-y-1 mt-1">
          {folder.snippets && folder.snippets.length > 0 ? (
            folder.snippets.map((snippet) => (
              <div
                key={snippet._id}
                onClick={() => onSnippetClick(snippet._id)}
                className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all ${activeSnippetId === snippet._id
                  ? "bg-[#1a73e8]/10 text-[#1a73e8] shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <span className="text-sm">{getLanguageIcon(snippet.language)}</span>
                <span className="text-xs font-medium truncate">{snippet.title}</span>
              </div>
            ))
          ) : (
            <div className="py-2 px-10 text-[11px] text-slate-400 italic">
              No snippets
            </div>
          )}
        </div>
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
        (s: Snippet) => !s.folder || s.folder === null
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
    <div className="w-[280px] border-r border-slate-200 p-4 h-screen overflow-auto bg-white flex flex-col">
      {/* Navigation Section */}
      <div className="space-y-1 mb-8">
        {[
          { label: "Dashboard", icon: "📊", path: "/dashboard/analytics" },
          { label: "Trending", icon: "🔥", path: "/dashboard/trending" },
          { label: "Teams", icon: "👥", path: "/dashboard/teams" },
        ].map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-all text-slate-700 font-semibold group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </div>
        ))}

        <div
          onClick={() => (window.location.href = "http://localhost:5000/api/auth/github")}
          className="flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-all text-slate-700 font-semibold mt-4 border border-dashed border-slate-200"
        >
          <GitHubIcon fontSize="small" className="text-slate-800" />
          <span className="text-sm">Connect GitHub</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Typography className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Explorer
        </Typography>
        <button
          onClick={() => navigate("/dashboard/folders/create")}
          className="p-1 px-3 text-[11px] font-extrabold bg-[#1a73e8] text-white rounded-lg shadow-sm hover:bg-[#1557b0] transition-colors"
        >
          NEW FOLDER
        </button>
      </div>

      <div className="flex flex-col gap-1">
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
        <div className="mt-4">
          <div
            onClick={() => setShowUnassigned(!showUnassigned)}
            className="flex items-center py-2 px-3 hover:bg-slate-50 cursor-pointer rounded-xl transition-colors min-h-[44px]"
          >
            <div className="min-w-[32px] flex items-center text-slate-400">
              {showUnassigned ? (
                <ExpandMoreIcon fontSize="small" />
              ) : (
                <ChevronRightIcon fontSize="small" />
              )}
            </div>
            <div className="min-w-[32px] flex items-center">
              <FolderOpenIcon fontSize="small" className="text-slate-400" />
            </div>
            <span className="text-sm font-semibold text-slate-500 truncate">
              Unassigned
            </span>
          </div>

          <Collapse in={showUnassigned} timeout="auto" unmountOnExit>
            <div className="pl-6 space-y-1 mt-1">
              {unassignedSnippets.length > 0 ? (
                unassignedSnippets.map((snippet) => (
                  <div
                    key={snippet._id}
                    onClick={() => handleSnippetClick(snippet._id)}
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all ${activeSnippetId === snippet._id
                      ? "bg-[#1a73e8]/10 text-[#1a73e8] shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                  >
                    <span className="text-sm">{getLanguageIcon(snippet.language)}</span>
                    <span className="text-xs font-medium truncate">{snippet.title}</span>
                  </div>
                ))
              ) : (
                <div className="py-2 px-10 text-[11px] text-slate-400 italic">
                  No unassigned snippets
                </div>
              )}
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  );
}
