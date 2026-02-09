import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Typography, Button } from "@mui/material";
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
      <div className="max-w-[900px] mx-auto mt-10 p-4">
        <div className="flex items-center gap-4 mb-8">
          <HistoryIcon className="text-3xl text-[#1a73e8]" />
          <Typography variant="h4" className="font-extrabold text-slate-800">
            Version History
          </Typography>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Typography className="text-slate-500 font-medium italic">No history found for this snippet.</Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((v) => (
              <div
                key={v._id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4 group"
              >
                <div>
                  <Typography variant="subtitle1" className="font-bold text-slate-800 group-hover:text-[#1a73e8] transition-colors">
                    Code Revision
                  </Typography>
                  <Typography variant="caption" className="text-slate-500 font-medium uppercase tracking-wider text-[10px] mt-1 block">
                    {new Date(v.editedAt).toLocaleString()}
                  </Typography>
                </div>
                <Button
                  variant="outlined"
                  startIcon={<RestoreIcon />}
                  size="small"
                  onClick={() => restore(v._id)}
                  className="normal-case font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-[#1a73e8] hover:text-[#1a73e8] rounded-xl px-4 py-2"
                >
                  Restore
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

