import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Collapse,
} from "@mui/material";
import { Reply as ReplyIcon } from "@mui/icons-material";
import {
  getComments,
  addComment,
  type Comment,
} from "../services/comment.service";

interface CommentThreadProps {
  comment: Comment;
  snippetId: string;
  depth?: number;
  onReplyAdded: () => void;
}

function CommentThread({
  comment,
  snippetId,
  depth = 0,
  onReplyAdded,
}: CommentThreadProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(snippetId, replyText, comment._id);
      setReplyText("");
      setShowReplyForm(false);
      onReplyAdded();
    } catch (err) {
      console.error("Reply error:", err);
      toast.error("Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        ml: depth * 3,
        mt: 2,
        borderLeft: depth > 0 ? "2px solid #e0e0e0" : "none",
        pl: depth > 0 ? 2 : 0,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          backgroundColor: depth % 2 === 0 ? "#fafafa" : "#ffffff",
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary">
              {comment.author?.name || "Unknown User"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(comment.createdAt).toLocaleString()}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ mb: 1 }}>
            {comment.text}
          </Typography>

          <Button
            size="small"
            startIcon={<ReplyIcon />}
            onClick={() => setShowReplyForm(!showReplyForm)}
            sx={{ textTransform: "none" }}
          >
            Reply
          </Button>

          <Collapse in={showReplyForm}>
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                multiline
                maxRows={3}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleReply}
                disabled={isSubmitting || !replyText.trim()}
              >
                Post
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyText("");
                }}
              >
                Cancel
              </Button>
            </Box>
          </Collapse>
        </CardContent>
      </Card>


      {comment.replies && comment.replies.length > 0 && (
        <Box>
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply._id}
              comment={reply}
              snippetId={snippetId}
              depth={depth + 1}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function CommentSection({ snippetId }: { snippetId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadComments = async () => {
    try {
      const res = await getComments(snippetId);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

  useEffect(() => {
    loadComments();
  }, [snippetId]);

  const handleAddComment = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      await addComment(snippetId, text);
      setText("");
      loadComments();
    } catch (err) {
      console.error("Comment error:", err);
      toast.error("Failed to post comment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" mb={2}>
        💬 Comments ({comments.length})
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 4, alignItems: 'flex-start' }}>
        <TextField
          fullWidth
          label="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          maxRows={4}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
        <Button
          variant="contained"
          onClick={handleAddComment}
          disabled={isLoading || !text.trim()}
          sx={{ px: 3, py: 1.5, borderRadius: 3, fontWeight: 700, mt: 0.5 }}
        >
          Post
        </Button>
      </Box>

      {comments.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          No comments yet. Be the first to comment!
        </Typography>
      ) : (
        comments.map((comment) => (
          <CommentThread
            key={comment._id}
            comment={comment}
            snippetId={snippetId}
            depth={0}
            onReplyAdded={loadComments}
          />
        ))
      )}
    </Box>
  );
}

