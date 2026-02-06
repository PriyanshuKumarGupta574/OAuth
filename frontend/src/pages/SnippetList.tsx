import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Box,
  Card,
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
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { snippetItemCard } from "../styles/snippet.styles";
import { getSnippets } from "../services/snippet.service";
import SearchBar from "../components/SearchBar";

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
  const [filters, setFilters] = useState<any>({});
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

  const handleSearch = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
    // Reset to page 1 on new search
    setPage(1);
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">My Snippets</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
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
              onClick={() => navigate("/dashboard/snippets/create")}
            >
              New Snippet
            </Button>
          </Box>
        </Box>

        {/* Enhanced Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* SNIPPET CARDS */}
        {snippets.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" mt={4}>
            No snippets found. Try adjusting your filters.
          </Typography>
        ) : (
          snippets.map((snippet) => (
            <Card
              key={snippet._id}
              sx={snippetItemCard}
              onClick={() =>
                navigate(`/dashboard/snippets/${snippet._id}`)
              }
            >
              <Typography variant="h6" fontWeight="bold">
                {snippet.title}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {snippet.language}
              </Typography>

              <Box sx={{ mt: 1 }}>
                {snippet.tags?.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                ))}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {snippet.visibility === "public" && <PublicIcon fontSize="small" color="action" titleAccess="Public" />}
                  {snippet.visibility === "private" && <LockIcon fontSize="small" color="action" titleAccess="Private" />}
                  {snippet.visibility === "team" && <GroupIcon fontSize="small" color="action" titleAccess="Team" />}
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                    {snippet.visibility}
                  </Typography>
                </Box>

                {snippet.views !== undefined && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <VisibilityIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {snippet.views} views
                    </Typography>
                  </Box>
                )}
              </Box>
            </Card>
          ))
        )}

        {/* Pagination */}
        {snippets.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
            <Button
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>

            <Typography>
              Page {page} of {totalPages}
            </Typography>

            <Button
              variant="outlined"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}
