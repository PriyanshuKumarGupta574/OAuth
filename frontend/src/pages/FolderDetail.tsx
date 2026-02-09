import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Typography, Chip } from "@mui/material";
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
      <div className="max-w-[900px] mx-auto mt-10 p-4">

        <Typography variant="h4" className="font-extrabold text-slate-800 mb-8 flex items-center gap-3">
          <span className="text-4xl text-amber-500">📁</span> {folderName}
        </Typography>

        {snippets.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <Typography className="text-slate-500 font-medium italic">
              No snippets inside this folder yet.
            </Typography>
          </div>
        ) : (
          <div className="space-y-6">
            {snippets.map((snippet) => (
              <div
                key={snippet._id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col"
                onClick={() => navigate(`/dashboard/snippets/${snippet._id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Typography variant="h6" className="font-bold text-slate-800 group-hover:text-[#1a73e8] transition-colors leading-tight">
                      {snippet.title}
                    </Typography>
                    <Typography variant="body2" className="text-slate-500 font-mono mt-1">
                      {snippet.language}
                    </Typography>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${snippet.visibility === "public" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}>
                    {snippet.visibility}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 mb-6 group-hover:border-blue-100 transition-colors">
                  <CodeViewer code={snippet.code} language={snippet.language} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {snippet.tags?.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      className="bg-slate-100 text-slate-600 border-none font-medium hover:bg-slate-200 transition-colors"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
