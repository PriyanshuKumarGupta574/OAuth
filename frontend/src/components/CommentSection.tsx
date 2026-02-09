import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Typography,
  TextField,
  Button,
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
    <div
      style={{
        marginLeft: depth > 0 ? `${depth * 24}px` : 0,
      }}
      className={`mt-4 ${depth > 0 ? "border-l-2 border-[#e0e0e0] pl-4" : ""}`}
    >
      <div
        className={`border border-slate-200 rounded-xl shadow-sm ${depth % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <Typography variant="subtitle2" className="font-bold text-[#1a73e8]">
              {comment.author?.name || "Unknown User"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(comment.createdAt).toLocaleString()}
            </Typography>
          </div>

          <Typography variant="body2" className="mb-2">
            {comment.text}
          </Typography>

          <Button
            size="small"
            startIcon={<ReplyIcon />}
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="normal-case font-bold"
          >
            Reply
          </Button>

          <Collapse in={showReplyForm}>
            <div className="mt-4 flex gap-2">
              <TextField
                fullWidth
                size="small"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                multiline
                maxRows={3}
                className="[&_.MuiOutlinedInput-root]:rounded-lg"
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleReply}
                disabled={isSubmitting || !replyText.trim()}
                className="bg-[#1a73e8] hover:bg-[#1557b0] shadow-none"
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
            </div>
          </Collapse>
        </div>
      </div>


      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply._id}
              comment={reply}
              snippetId={snippetId}
              depth={depth + 1}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
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
    <div className="mt-12">
      <Typography variant="h5" className="mb-6 font-extrabold flex items-center gap-2">
        💬 Comments ({comments.length})
      </Typography>

      <div className="flex gap-2 mb-8 items-start">
        <TextField
          fullWidth
          label="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          maxRows={4}
          className="[&_.MuiOutlinedInput-root]:rounded-2xl"
        />
        <Button
          variant="contained"
          onClick={handleAddComment}
          disabled={isLoading || !text.trim()}
          className="px-6 py-3.5 bg-[#1a73e8] hover:bg-[#1557b0] shadow-none rounded-2xl font-bold mt-1"
        >
          Post
        </Button>
      </div>

      {comments.length === 0 ? (
        <Typography variant="body2" color="text.secondary" className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
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
    </div>
  );
}
