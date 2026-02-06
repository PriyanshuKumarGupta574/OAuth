import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { snippetItemCard } from "../styles/snippet.styles";
import { getSnippets } from "../services/snippet.service";

type Snippet = {
  _id: string;
  title: string;
  language: string;
  code: string;
  visibility: "public" | "private";
  tags?: string[];
};

export default function SnippetList() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [languageFilter, setLanguageFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    getSnippets(tagFilter, languageFilter, page).then((res) => {
      setSnippets(res.data.snippets);
      setTotalPages(res.data.pages);
    });
  }, [tagFilter, languageFilter, page]);

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
        {/* Create Snippet */}
        <Button
          variant="contained"
          sx={{ mb: 3 }}
          onClick={() => navigate("/dashboard/snippets/create")}
        >
          + New Snippet
        </Button>

        {/* Filters */}
        <TextField
          label="Filter by language"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) => {
            setLanguageFilter(e.target.value);
            setPage(1);
          }}
        />

        <TextField
          label="Filter by tag"
          fullWidth
          sx={{ mb: 4 }}
          onChange={(e) => {
            setTagFilter(e.target.value);
            setPage(1);
          }}
        />

        {/* SNIPPET CARDS */}
        {snippets.map((snippet) => (
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

            <Typography variant="caption" color="primary">
              {snippet.visibility}
            </Typography>
          </Card>
        ))}

        {/* Pagination */}
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
      </Box>
    </DashboardLayout>
  );
}



