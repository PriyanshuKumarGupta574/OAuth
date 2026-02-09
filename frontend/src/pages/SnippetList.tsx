import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Typography,
  Button,
  Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import DashboardLayout from "../layout/DashboardLayout";

import { getSnippets } from "../services/snippet.service";
import SearchBar from "../components/SearchBar";
import type { SnippetFilters } from "../types";

type Snippet = {
  _id: string;
  title: string;
  language: string;
  code: string;
  visibility: "public" | "private" | "team";
  tags?: string[];
  views?: number;
};

export default function SnippetList() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [filters, setFilters] = useState<SnippetFilters>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    // tag, language, page, search, author, startDate, endDate
    getSnippets(
      filters.tag,
      filters.language,
      page,
      filters.search,
      filters.author,
      filters.startDate,
      filters.endDate
    ).then((res) => {
      setSnippets(res.data.snippets);
      setTotalPages(res.data.pages);
    });
  }, [filters, page]);

  const handleSearch = (newFilters: SnippetFilters) => {
    setFilters({ ...filters, ...newFilters });
    // Reset to page 1 on new search
    setPage(1);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[900px] mx-auto mt-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Typography variant="h4" className="font-extrabold text-slate-800">My Snippets</Typography>
          <div className="flex gap-3">
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 normal-case font-bold px-4 py-2"
              onClick={async () => {
                const gistId = prompt("Enter GitHub Gist ID to import:");
                if (gistId) {
                  const toastId = toast.loading("Importing Gist...");
                  try {
                    const token = localStorage.getItem("token");
                    const res = await fetch("http://localhost:5000/api/github/import", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                      },
                      body: JSON.stringify({ gistId })
                    });
                    const data = await res.json();
                    if (res.ok) {
                      toast.update(toastId, { render: "Gist imported successfully!", type: "success", isLoading: false, autoClose: 3000 });
                      navigate(`/dashboard/snippets/${data._id}`);
                    } else {
                      toast.update(toastId, { render: "Import failed: " + data.message, type: "error", isLoading: false, autoClose: 3000 });
                    }
                  } catch (e) {
                    toast.update(toastId, { render: "Error importing Gist", type: "error", isLoading: false, autoClose: 3000 });
                  }
                }
              }}
            >
              Import Gist
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              className="bg-[#1a73e8] hover:bg-[#1557b0] shadow-none normal-case font-bold px-5 py-2 rounded-lg"
              onClick={() => navigate("/dashboard/snippets/create")}
            >
              New Snippet
            </Button>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* SNIPPET CARDS */}
        {snippets.length === 0 ? (
          <Typography variant="body1" color="text.secondary" className="text-center mt-12 py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            No snippets found. Try adjusting your filters.
          </Typography>
        ) : (
          <div className="space-y-4">
            {snippets.map((snippet) => (
              <div
                key={snippet._id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col"
                onClick={() => navigate(`/dashboard/snippets/${snippet._id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <Typography variant="h6" className="font-extrabold text-slate-800 group-hover:text-[#1a73e8] transition-colors leading-tight">
                      {snippet.title}
                    </Typography>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-tighter">
                        {snippet.language}
                      </span>
                    </div>
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 ${snippet.visibility === "public" ? "bg-emerald-100 text-emerald-700" :
                    snippet.visibility === "private" ? "bg-slate-100 text-slate-600" : "bg-blue-100 text-blue-700"
                    }`}>
                    {snippet.visibility === "public" && <PublicIcon className="text-[14px]" />}
                    {snippet.visibility === "private" && <LockIcon className="text-[14px]" />}
                    {snippet.visibility === "team" && <GroupIcon className="text-[14px]" />}
                    {snippet.visibility}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {snippet.tags?.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      className="bg-slate-50 text-slate-500 border border-slate-100 font-medium h-6 text-[10px] hover:bg-slate-100 transition-colors"
                    />
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center text-slate-400">
                  <div className="flex items-center gap-1">
                    <VisibilityIcon className="text-sm opacity-60" />
                    <span className="text-[11px] font-bold">{snippet.views || 0} views</span>
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-widest group-hover:text-[#1a73e8] transition-colors flex items-center gap-1">
                    View Details <span className="text-lg leading-none mt-[-2px]">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {snippets.length > 0 && (
          <div className="flex justify-center items-center mt-12 gap-6 pb-8">
            <Button
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-6 py-2 rounded-lg border-slate-300"
            >
              Prev
            </Button>

            <Typography className="text-slate-600 font-medium whitespace-nowrap">
              Page {page} of {totalPages}
            </Typography>

            <Button
              variant="outlined"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-6 py-2 rounded-lg border-slate-300"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
