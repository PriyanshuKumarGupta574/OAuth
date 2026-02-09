import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Box, Card, Typography, Chip } from "@mui/material";
import DashboardLayout from "../layout/DashboardLayout";
import { getSnippetsByFolder } from "../services/snippet.service";
import { getFolderById } from "../services/folder.service";
import CodeViewer from "../components/CodeViewer";


type Snippet = {
  _id: string;
  title: string;
  language: string;
  code: string;  
  visibility: "public" | "private";
  tags?: string[];
};

export default function FolderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    if (!id) return;


    getFolderById(id)
      .then((res) => setFolderName(res.data.name))
      .catch(() => setFolderName("Folder"));

    getSnippetsByFolder(id)
      .then((res) => setSnippets(res.data))
      .catch(() => setSnippets([]));
  }, [id]);

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
        
        <Typography variant="h4" fontWeight="bold" mb={3}>
          📁 {folderName}
        </Typography>

        {snippets.length === 0 && (
          <Typography color="text.secondary">
            No snippets inside this folder yet.
          </Typography>
        )}

       

{snippets.map((snippet) => (
  <Card
    key={snippet._id}
    sx={{
      p: 3,
      mb: 2,
      cursor: "pointer",
      borderRadius: 3,
      boxShadow: 2,
    }}
    onClick={() =>
      navigate(`/dashboard/snippets/${snippet._id}`)
    }
  >
    <Typography fontWeight="bold" fontSize={18}>
      {snippet.title}
    </Typography>

    <Typography variant="body2" color="text.secondary">
      {snippet.language}
    </Typography>

    
    <Box sx={{ mt: 2 }}>
      <CodeViewer code={snippet.code} language={snippet.language} />
    </Box>


    <Box sx={{ mt: 1 }}>
      {snippet.tags?.map((tag) => (
        <Chip key={tag} label={tag} size="small" sx={{ mr: 1 }} />
      ))}
    </Box>

    <Typography
      variant="caption"
      color="primary"
      sx={{ mt: 1, display: "block" }}
    >
      {snippet.visibility}
    </Typography>
  </Card>
))}

      </Box>
    </DashboardLayout>
  );
}


