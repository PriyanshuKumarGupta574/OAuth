import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Box, Card, Typography, Button, Stack, Tooltip, Divider, Chip } from "@mui/material";
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
      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
        <Card sx={{ p: 4, borderRadius: "20px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h4" fontWeight={700}>
              {snippet.title}
            </Typography>
            <Chip
              label={snippet.language}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600, textTransform: 'uppercase' }}
            />
          </Box>

          <CodeViewer code={snippet.code} language={snippet.language} />

          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mt: 3, mb: 1 }}>
            {/* Code Actions */}
            <Button
              variant="contained"
              startIcon={<ContentCopyIcon />}
              onClick={copyCode}
              sx={{ px: 3 }}
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
            >
              Download
            </Button>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }} />

            {/* Collaboration Actions */}
            <Tooltip title="Copy public share link">
              <Button variant="outlined" startIcon={<ShareIcon />} onClick={shareSnippet}>
                Share
              </Button>
            </Tooltip>

            <Button variant="outlined" startIcon={<CallSplitIcon />} onClick={handleFork}>
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
            >
              Gist
            </Button>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }} />

            {/* Management Actions */}
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/dashboard/snippets/edit/${snippet._id}`)}
            >
              Edit
            </Button>

            <Button
              variant="outlined"
              startIcon={<HistoryIcon />}
              onClick={() => navigate(`/dashboard/snippets/${snippet._id}/history`)}
            >
              History
            </Button>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{
                bgcolor: 'error.light',
                '&:hover': { bgcolor: 'error.main' },
                boxShadow: 'none'
              }}
            >
              Delete
            </Button>
          </Stack>
        </Card>
        <CommentSection snippetId={snippet._id} />

      </Box>
    </DashboardLayout>
  );
}


