import { useState, useEffect } from "react";
import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  MenuItem,
  Chip,
  Stack,
} from "@mui/material";
import Editor from "@monaco-editor/react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  snippetContainer,
  snippetCard,
  snippetButton,
} from "../styles/snippet.styles";
import { createSnippet } from "../services/snippet.service";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import { getFolders } from "../services/folder.service";

type Folder = {
  _id: string;
  name: string;
};

export default function CreateSnippet() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Start typing your code...");
  const [visibility, setVisibility] = useState<"public" | "private">("private");

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [folderId, setFolderId] = useState("");
  const [folders, setFolders] = useState<Folder[]>([]);

  
  useEffect(() => {
    getFolders().then((res) => setFolders(res.data));
  }, []);

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
    }
    setTagInput("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      await createSnippet({
        title,
        language,
        code,
        tags,
        visibility,
        folder: folderId || null, 
      });

      
      setTitle("");
      setLanguage("javascript");
      setCode("// Start typing your code...");
      setTags([]);
      setVisibility("private");
      setFolderId("");
    } catch (error) {
      console.error("Failed to create snippet", error);
    }
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
          Create Snippet 🚀
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
            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="public">Public</MenuItem>
          </TextField>

          <TextField
            select
            label="Assign Folder"
            fullWidth
            sx={{ mb: 3 }}
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
          >
            <MenuItem value="">No Folder</MenuItem>

            {folders.map((f) => (
              <MenuItem key={f._id} value={f._id}>
                📁 {f.name}
              </MenuItem>
            ))}
          </TextField>

       
          <TextField
            label="Add Tag"
            fullWidth
            sx={{ mb: 2 }}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
          />

          <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => setTags(tags.filter((t) => t !== tag))}
              />
            ))}
          </Stack>

         
          <Box sx={{ mb: 3 }}>
            <Editor
              height="400px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
              }}
            />
          </Box>

          <Button variant="outlined" sx={{ mt: 2 }} onClick={formatCode}>
            Auto Format
          </Button>

      
          <Button
            variant="contained"
            size="large"
            sx={snippetButton}
            onClick={handleSubmit}
          >
            Save Snippet
          </Button>
        </Card>
      </Box>
    </DashboardLayout>
  );
}






