import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  TextField,
  Typography,
  Button,
  MenuItem,
  Chip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import Editor from "@monaco-editor/react";
import DashboardLayout from "../layout/DashboardLayout";
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
      <div className="max-w-[1000px] mx-auto mt-10 p-4">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-blue-50 rounded-2xl text-[#1a73e8]">
            <span className="text-3xl">🚀</span>
          </div>
          <Typography variant="h4" className="font-extrabold text-slate-800">
            Create Snippet
          </Typography>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <TextField
              label="Snippet Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="[&_.MuiOutlinedInput-root]:rounded-xl md:col-span-2"
              variant="outlined"
            />

            <TextField
              select
              label="Language"
              fullWidth
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="[&_.MuiOutlinedInput-root]:rounded-xl"
              variant="outlined"
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
              value={teamId}
              onChange={(e) => {
                setTeamId(e.target.value);
                if (e.target.value) setVisibility("team");
              }}
              className="[&_.MuiOutlinedInput-root]:rounded-xl"
              variant="outlined"
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
              value={visibility}
              onChange={(e) =>
                setVisibility(e.target.value as "public" | "private" | "team")
              }
              className="[&_.MuiOutlinedInput-root]:rounded-xl"
              variant="outlined"
            >
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="team" disabled={!teamId}>Team Only</MenuItem>
            </TextField>

            <TextField
              select
              label="Assign Folder"
              fullWidth
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="[&_.MuiOutlinedInput-root]:rounded-xl"
              variant="outlined"
            >
              <MenuItem value="">No Folder</MenuItem>
              {folders.map((f) => (
                <MenuItem key={f._id} value={f._id}>
                  📁 {f.name}
                </MenuItem>
              ))}
            </TextField>

            <div className="md:col-span-2 space-y-4">
              <TextField
                label="Add Tag"
                fullWidth
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                className="[&_.MuiOutlinedInput-root]:rounded-xl"
                variant="outlined"
                placeholder="Press Enter to add"
              />

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => setTags(tags.filter((t) => t !== tag))}
                    className="bg-slate-100 text-slate-600 border-none font-medium text-xs hover:bg-slate-200 transition-colors"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 mb-8 shadow-inner">
            <Editor
              height="500px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 20, bottom: 20 }
              }}
            />
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
            <Button
              variant="outlined"
              startIcon={<AutoFixHighIcon />}
              onClick={formatCode}
              className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none font-bold normal-case px-8 py-4 rounded-xl text-lg flex-1"
            >
              Auto Format
            </Button>

            <Button
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              className="bg-[#1a73e8] hover:bg-[#1557b0] shadow-none font-bold normal-case px-8 py-4 rounded-xl text-lg flex-1"
            >
              Save Snippet
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
