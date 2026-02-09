import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Typography, Button, Tooltip } from "@mui/material";
//import Editor from "@monaco-editor/react";
import DashboardLayout from "../layout/DashboardLayout";
import { getSnippetById } from "../services/snippet.service";
import { forkSnippet } from "../services/snippet.service";
import { deleteSnippet } from "../services/snippet.service";
import CodeViewer from "../components/CodeViewer";
import CommentSection from "../components/CommentSection";
import { trackSnippetView } from "../services/analytics.service";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import GitHubIcon from "@mui/icons-material/GitHub";
import EditIcon from "@mui/icons-material/Edit";




type Snippet = {
  _id: string;
  title: string;
  language: string;
  code: string;
};

export default function SnippetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState<Snippet | null>(null);

  useEffect(() => {
    if (id) {
      getSnippetById(id).then((res) => setSnippet(res.data));
      // Track view
      trackSnippetView(id).catch((err) => console.error("Failed to track view:", err));
    }
  }, [id]);

  const copyCode = () => {
    navigator.clipboard.writeText(snippet?.code || "");
  };

  if (!snippet) return null;

  const shareSnippet = () => {
    if (!snippet) return;

    const link = `${window.location.origin}/public/snippet/${snippet._id}`;
    navigator.clipboard.writeText(link);
    toast.success("Public link copied to clipboard!");
  };

  const handleFork = async () => {
    await forkSnippet(snippet!._id);
    navigate("/dashboard/snippets");
  };


  const handleDelete = async () => {
    if (!snippet) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this snippet?");
    if (!confirmDelete) return;

    await deleteSnippet(snippet._id);
    toast.success("Snippet deleted successfully");
    navigate("/dashboard/snippets");
  };




  return (
    <DashboardLayout>
      <div className="max-w-[1000px] mx-auto mt-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <Typography variant="h4" className="font-extrabold text-slate-800 leading-tight">
              {snippet.title}
            </Typography>
            <div className="flex items-center gap-2">
              <span className="px-4 py-1.5 bg-blue-50 text-[#1a73e8] rounded-xl font-bold text-xs border border-blue-100 uppercase tracking-widest">
                {snippet.language}
              </span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-100 mb-8 shadow-inner">
            <CodeViewer code={snippet.code} language={snippet.language} />
          </div>

          <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-50">
            {/* Primary Actions */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button
                variant="contained"
                startIcon={<ContentCopyIcon />}
                onClick={copyCode}
                className="bg-[#1a73e8] hover:bg-[#1557b0] shadow-none font-bold normal-case px-6 py-2.5 rounded-xl h-11"
              >
                Copy Code
              </Button>

              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={() => {
                  const element = document.createElement("a");
                  const file = new Blob([snippet.code], { type: 'text/plain' });
                  element.href = URL.createObjectURL(file);
                  element.download = `${snippet.title}.${snippet.language === 'javascript' ? 'js' : snippet.language}`;
                  document.body.appendChild(element);
                  element.click();
                }}
                className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none font-bold normal-case px-6 py-2.5 rounded-xl h-11"
              >
                Download
              </Button>
            </div>

            <div className="hidden md:block w-px h-11 bg-slate-200 mx-1" />

            {/* Sharing/Forking */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Tooltip title="Copy public share link">
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={shareSnippet}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none font-bold normal-case px-6 py-2.5 rounded-xl h-11"
                >
                  Share
                </Button>
              </Tooltip>

              <Button
                variant="outlined"
                startIcon={<CallSplitIcon />}
                onClick={handleFork}
                className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none font-bold normal-case px-6 py-2.5 rounded-xl h-11"
              >
                Fork
              </Button>

              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                onClick={async () => {
                  if (window.confirm("Export this snippet as a GitHub Gist?")) {
                    try {
                      const token = localStorage.getItem("token");
                      const res = await fetch(`http://localhost:5000/api/github/export/${snippet._id}`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      const data = await res.json();
                      if (res.ok) {
                        toast.success(`Exported! Gist URL: ${data.html_url}`);
                      } else {
                        toast.error("Export failed: " + data.message);
                      }
                    } catch (e) {
                      toast.error("Error exporting to Gist");
                    }
                  }
                }}
                className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none font-bold normal-case px-6 py-2.5 rounded-xl h-11"
              >
                Gist
              </Button>
            </div>

            <div className="hidden md:block w-px h-11 bg-slate-200 mx-1" />

            {/* Management Actions */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/dashboard/snippets/edit/${snippet._id}`)}
                className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none font-bold normal-case px-6 py-2.5 rounded-xl h-11"
              >
                Edit
              </Button>

              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => navigate(`/dashboard/snippets/${snippet._id}/history`)}
                className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none font-bold normal-case px-6 py-2.5 rounded-xl h-11"
              >
                History
              </Button>
            </div>

            <div className="flex-grow hidden md:block" />

            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              className="bg-red-50 text-red-600 hover:bg-red-100 shadow-none font-bold normal-case px-6 py-2.5 rounded-xl h-11 border border-red-100 w-full md:w-auto"
            >
              Delete
            </Button>
          </div>
        </div>
        <CommentSection snippetId={snippet._id} />

      </div>
    </DashboardLayout>
  );
}
