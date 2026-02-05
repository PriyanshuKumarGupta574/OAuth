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

import {
  DndContext,
  type DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import DraggableSnippet from "../components/DraggableSnippet";

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

  // 🔥 drag end (for now just logs)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    console.log("Dragged snippet:", active.id);
    console.log("Dropped over:", over.id);

    // NEXT STEP: call API to move snippet into folder
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
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

        {/* 🔥 DRAG CONTEXT */}
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={snippets.map((s) => s._id)}
            strategy={verticalListSortingStrategy}
          >




            {snippets.map((snippet) => (



             <DraggableSnippet key={snippet._id} id={snippet._id}>
  <Card sx={snippetItemCard}>
    <Box
      onClick={() =>
        navigate(`/dashboard/snippets/${snippet._id}`)
      }
      sx={{ cursor: "pointer" }}
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
    </Box>
  </Card>
</DraggableSnippet>

            ))}
          </SortableContext>
        </DndContext>

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










       {/* SNIPPET CARDS */}
        {/* {snippets.map((snippet) => (
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
                <Chip key={tag} label={tag} size="small" sx={{ mr: 1 }} />
              ))}
            </Box>

            <Typography variant="caption" color="primary">
              {snippet.visibility}
            </Typography>
          </Card>
        ))} */}

        {/* SNIPPET CARDS */}




// import { useEffect, useState } from "react";
// import {
//   Box,
//   Card,
//   Typography,
//   Button,
//   TextField,
//   Chip,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import DashboardLayout from "../layout/DashboardLayout";
// import { snippetItemCard } from "../styles/snippet.styles";
// import { getSnippets } from "../services/snippet.service";

// type Snippet = {
//   _id: string;
//   title: string;
//   language: string;
//   code: string;
//   visibility: "public" | "private";
//   tags?: string[];
// };

// export default function SnippetList() {
//   const [snippets, setSnippets] = useState<Snippet[]>([]);
//   const [languageFilter, setLanguageFilter] = useState("");
//   const [tagFilter, setTagFilter] = useState("");
//   const navigate = useNavigate();

//   /* ==========================================
//      FETCH SNIPPETS WITH FILTER
//   ========================================== */
//   useEffect(() => {
//     getSnippets(tagFilter, languageFilter).then((res) =>
//       setSnippets(res.data)
//     );
//   }, [tagFilter, languageFilter]);

//   return (
//     <DashboardLayout>
//       <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
//         {/* CREATE BUTTON */}
//         <Button
//           variant="contained"
//           sx={{ mb: 3 }}
//           onClick={() => navigate("/dashboard/snippets/create")}
//         >
//           + New Snippet
//         </Button>

//         {/* SEARCH BY LANGUAGE */}
//         <TextField
//           label="Filter by language"
//           fullWidth
//           sx={{ mb: 2 }}
//           onChange={(e) => setLanguageFilter(e.target.value)}
//         />

//         {/* SEARCH BY TAG */}
//         <TextField
//           label="Filter by tag"
//           fullWidth
//           sx={{ mb: 4 }}
//           onChange={(e) => setTagFilter(e.target.value)}
//         />

//         {/* SNIPPET CARDS */}
//         {snippets.map((snippet) => (
//           <Card
//             key={snippet._id}
//             sx={snippetItemCard}
//             onClick={() =>
//               navigate(`/dashboard/snippets/${snippet._id}`)
//             }
//           >
//             <Typography variant="h6" fontWeight="bold">
//               {snippet.title}
//             </Typography>

//             <Typography variant="body2" color="text.secondary">
//               {snippet.language}
//             </Typography>

//             {/* TAGS */}
//             <Box sx={{ mt: 1 }}>
//               {snippet.tags?.map((tag) => (
//                 <Chip
//                   key={tag}
//                   label={tag}
//                   size="small"
//                   sx={{ mr: 1, mb: 1 }}
//                 />
//               ))}
//             </Box>

//             {/* VISIBILITY */}
//             <Typography variant="caption" color="primary">
//               {snippet.visibility}
//             </Typography>
//           </Card>
//         ))}
//       </Box>
//     </DashboardLayout>
//   );
// }


