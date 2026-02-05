import { useEffect, useState } from "react";
import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import DashboardLayout from "../layout/DashboardLayout";
import { getSnippetById, updateSnippet } from "../services/snippet.service";
import {
  snippetContainer,
  snippetCard,
  snippetButton,
} from "../styles/snippet.styles";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";


export default function EditSnippet() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("private");

  useEffect(() => {
    if (id) {
      getSnippetById(id).then((res) => {
        setTitle(res.data.title);
        setLanguage(res.data.language);
        setCode(res.data.code);
        setVisibility(res.data.visibility);
      });
    }
  }, [id]);

  const handleUpdate = async () => {
    await updateSnippet(id!, {
      title,
      language,
      code,
      visibility,
    });

    navigate("/dashboard/snippets");
  };

  
const formatCode = async () => {
  try {
    const formatted = await prettier.format(code, {
      parser: "babel",
      plugins: [parserBabel],
      semi: true,
      singleQuote: true,
    });

    setCode(formatted);
  } catch (err) {
    console.error("Formatting error", err);
  }
};


  return (
    <DashboardLayout>
      <Box sx={snippetContainer}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Edit Snippet ✏️
        </Typography>

        <Card sx={snippetCard}>
          <TextField
            label="Snippet Title"
            fullWidth
            sx={{ mb: 3 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            select
            label="Language"
            fullWidth
            sx={{ mb: 3 }}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {[
              "javascript",
              "typescript",
              "python",
              "java",
              "cpp",
              "csharp",
              "go",
              "rust",
              "php",
            ].map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Visibility"
            fullWidth
            sx={{ mb: 3 }}
            value={visibility}
            onChange={(e) =>
              setVisibility(e.target.value as "public" | "private")
            }
          >
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="private">Private</MenuItem>
          </TextField>

          <Box sx={{ mb: 3 }}>
            <Editor
              height="400px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
            />
          </Box>

          <Button variant="outlined" onClick={formatCode}>
           Auto Format
          </Button>


          <Button
            variant="contained"
            size="large"
            sx={snippetButton}
            onClick={handleUpdate}
          >
            Update Snippet
          </Button>
        </Card>
      </Box>
    </DashboardLayout>
  );
}



