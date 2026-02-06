import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Card } from "@mui/material";
import { getComments, addComment } from "../services/comment.service";

export default function CommentSection({ snippetId }: { snippetId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");

  const loadComments = () => {
    getComments(snippetId).then((res) => setComments(res.data));
  };

  useEffect(() => {
    loadComments();
  }, [snippetId]);



const handleAddComment = async () => {
  if (!text.trim()) return;

  try {
    const res = await addComment(snippetId, text);
    console.log("comment response", res);

    setText("");
    loadComments();
  } catch (err) {
    console.error("Comment error:", err);
    alert("Failed to post comment");
  }
};


  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" mb={2}>
        💬 Comments
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddComment}>
          Post
        </Button>
      </Box>

      {comments.map((c) => (
        <Card key={c._id} sx={{ p: 2, mb: 2 }}>
          <Typography fontWeight="bold">{c.author?.name}</Typography>
          <Typography variant="body2">{c.text}</Typography>
        </Card>
      ))}
    </Box>
  );
}
