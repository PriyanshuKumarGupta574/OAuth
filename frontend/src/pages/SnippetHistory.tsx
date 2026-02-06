import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, Typography, Button, Stack } from "@mui/material";
import { toast } from "react-toastify";
import HistoryIcon from "@mui/icons-material/History";
import RestoreIcon from "@mui/icons-material/Restore";
import DashboardLayout from "../layout/DashboardLayout";
import {
  getSnippetHistory,
  restoreSnippetVersion,
} from "../services/snippet.service";

type Version = {
  _id: string;
  code: string;
  editedAt: string;
};

export default function SnippetHistory() {
  const { id } = useParams();
  const [history, setHistory] = useState<Version[]>([]);

  useEffect(() => {
    if (id) {
      getSnippetHistory(id).then((res) => setHistory(res.data));
    }
  }, [id]);

  const restore = async (versionId: string) => {
    try {
      await restoreSnippetVersion(versionId);
      toast.success("Version restored successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Restore failed");
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <HistoryIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" fontWeight={700}>
            Version History
          </Typography>
        </Box>

        {history.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
            No history found for this snippet.
          </Typography>
        ) : (
          history.map((v) => (
            <Card key={v._id} sx={{ p: 3, mb: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Code Revision
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(v.editedAt).toLocaleString()}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<RestoreIcon />}
                  size="small"
                  onClick={() => restore(v._id)}
                >
                  Restore
                </Button>
              </Stack>
            </Card>
          ))
        )}
      </Box>
    </DashboardLayout>
  );
}

