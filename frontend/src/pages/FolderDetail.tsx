import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Typography } from "@mui/material";
import DashboardLayout from "../layout/DashboardLayout";
import { getSnippetsByFolder } from "../services/snippet.service";

export default function FolderDetail() {
  const { id } = useParams();
  const [snippets, setSnippets] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getSnippetsByFolder(id).then(res => setSnippets(res.data));
    }
  }, [id]);

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
        <Typography variant="h4" mb={3}>
          Folder Snippets
        </Typography>

        {snippets.map(snippet => (
          <Card
            key={snippet._id}
            sx={{ p: 3, mb: 2, cursor: "pointer" }}
            onClick={() =>
              navigate(`/dashboard/snippets/${snippet._id}`)
            }
          >
            <Typography fontWeight="bold">
              {snippet.title}
            </Typography>
            <Typography variant="body2">
              {snippet.language}
            </Typography>
          </Card>
        ))}
      </Box>
    </DashboardLayout>
  );
}
