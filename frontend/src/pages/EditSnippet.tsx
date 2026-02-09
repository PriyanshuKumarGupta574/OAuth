import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  MenuItem,
  Stack,
  Divider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import EditIcon from "@mui/icons-material/Edit";
import { useParams, useNavigate } from "react-router";
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
  const [visibility, setVisibility] = useState<"public" | "private" | "team">("private");

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
      toast.success("Code formatted!");
    } catch (err) {
      console.error("Formatting error", err);
      toast.error("Formatting failed");
    }
  };


  return (
    <DashboardLayout>
      <Box sx={snippetContainer}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <EditIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" fontWeight={700}>
            Edit Snippet
          </Typography>
        </Box>

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
              setVisibility(e.target.value as "public" | "private" | "team")
            }
          >
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="team">Team Only</MenuItem>
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

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<AutoFixHighIcon />}
              onClick={formatCode}
              sx={{ borderRadius: "10px" }}
            >
              Auto Format
            </Button>

            <Button
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              sx={{
                ...snippetButton,
                borderRadius: "10px",
                px: 4,
                fontWeight: 700
              }}
              onClick={handleUpdate}
            >
              Update Snippet
            </Button>
          </Stack>
        </Card>
      </Box>
    </DashboardLayout>
  );
}



