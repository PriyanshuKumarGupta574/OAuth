import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  TextField,
  Typography,
  Button,
  MenuItem,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import EditIcon from "@mui/icons-material/Edit";
import { useParams, useNavigate } from "react-router";
import Editor from "@monaco-editor/react";
import DashboardLayout from "../layout/DashboardLayout";
import { getSnippetById, updateSnippet } from "../services/snippet.service";

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
      <div className="max-w-[1000px] mx-auto mt-10 p-4">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-blue-50 rounded-2xl text-[#1a73e8]">
            <EditIcon className="text-3xl" />
          </div>
          <Typography variant="h4" className="font-extrabold text-slate-800">
            Edit Snippet
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
              label="Visibility"
              fullWidth
              value={visibility}
              onChange={(e) =>
                setVisibility(e.target.value as "public" | "private" | "team")
              }
              className="[&_.MuiOutlinedInput-root]:rounded-xl"
              variant="outlined"
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="team">Team Only</MenuItem>
            </TextField>
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
              onClick={handleUpdate}
              className="bg-[#1a73e8] hover:bg-[#1557b0] shadow-none font-bold normal-case px-8 py-4 rounded-xl text-lg flex-1"
            >
              Update Snippet
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
