import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box, Card, Typography } from "@mui/material";
import Editor from "@monaco-editor/react";
import { getPublicSnippet } from "../services/snippet.service";


type Snippet = {
  _id: string;
  title: string;
  language: string;
  code: string;
};

export default function PublicSnippet() {
  const { id } = useParams();
  const [snippet, setSnippet] = useState<Snippet | null>(null);

  useEffect(() => {
    if (id) {
      getPublicSnippet(id).then((res) => setSnippet(res.data));
    }
  }, [id]);

  if (!snippet) return null;

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
      <Card sx={{ p: 4 }}>
        <Typography variant="h4">{snippet.title}</Typography>
        <Typography>{snippet.language}</Typography>

        <Editor
          height="500px"
          language={snippet.language}
          value={snippet.code}
          theme="vs-dark"
          options={{ readOnly: true }}
        />
      </Card>
    </Box>
  );
}
