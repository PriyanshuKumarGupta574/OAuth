import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  MenuItem,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
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
import { getMyTeams } from "../services/team.service";

type Folder = {
  _id: string;
  name: string;
};

type Team = {
  _id: string;
  name: string;
};

export default function CreateSnippet() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Start typing your code...");
  const [visibility, setVisibility] = useState<"public" | "private" | "team">("private");

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [folderId, setFolderId] = useState("");
  const [folders, setFolders] = useState<Folder[]>([]);

  const [teamId, setTeamId] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    getFolders().then((res) => setFolders(res.data));
    getMyTeams().then((res) => setTeams(res.data));
  }, []);

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
    }
    setTagInput("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Snippet title is required");
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
      toast.success("Snippet created successfully! 🚀");
    } catch (error) {
      console.error("Failed to create snippet", error);
      toast.error("Failed to create snippet. Please try again.");
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
      toast.success("Code formatted!");
    } catch (err) {
      console.error("Formatting error", err);
      toast.error("Formatting failed. Check your syntax.");
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
            label="Assign Team (Optional)"
            fullWidth
            sx={{ mb: 3 }}
            value={teamId}
            onChange={(e) => {
              setTeamId(e.target.value);
              if (e.target.value) setVisibility("team");
            }}
          >
            <MenuItem value="">None (Personal)</MenuItem>
            {teams.map((t) => (
              <MenuItem key={t._id} value={t._id}>
                👥 {t.name}
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
            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="team" disabled={!teamId}>Team Only</MenuItem>
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
              onClick={handleSubmit}
            >
              Save Snippet
            </Button>
          </Stack>
        </Card>
      </Box>
    </DashboardLayout>
  );
}






