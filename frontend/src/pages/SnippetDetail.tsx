import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Typography, Button } from "@mui/material";
import Editor from "@monaco-editor/react";
import DashboardLayout from "../layout/DashboardLayout";
import { getSnippetById } from "../services/snippet.service";
import { forkSnippet } from "../services/snippet.service";
import { deleteSnippet } from "../services/snippet.service";



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

  alert("Public link copied to clipboard!");
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

  alert("Snippet deleted successfully");
  navigate("/dashboard/snippets");
};




  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
        <Card sx={{ p: 4, borderRadius: "20px" }}>
          <Typography variant="h4" mb={2}>
            {snippet.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Language: {snippet.language}
          </Typography>

          <Editor
            height="500px"
            language={snippet.language}
            value={snippet.code}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />

          {/* ACTION BUTTONS */}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button variant="contained" onClick={copyCode}>
              Copy Code
            </Button>

            <Button variant="outlined" sx={{ mt: 3, ml: 2 }} onClick={shareSnippet}>
             Share
            </Button>

            <Button variant="outlined" sx={{ mt: 2, ml: 2 }} onClick={handleFork}>
             Fork
            </Button>

            <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            >
            Delete
            </Button>

            <Button
            variant="outlined"
            onClick={() => navigate(`/dashboard/snippets/${snippet._id}/history`)}
            >
            View History
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate(`/dashboard/snippets/edit/${snippet._id}`)}
            >
              Edit Snippet
            </Button>
          </Box>
        </Card>
      </Box>
    </DashboardLayout>
  );
}


