import { useState } from "react";
import { Typography, TextField, Button } from "@mui/material";
import { toast } from "react-toastify";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DashboardLayout from "../layout/DashboardLayout";
import { createFolder } from "../services/folder.service";
import { useNavigate } from "react-router";

export default function CreateFolder() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      if (!name) {
        toast.error("Folder name is required");
        return;
      }

      await createFolder({ name });

      navigate("/dashboard/snippets");
    } catch (err) {
      console.error(err);
      alert("Failed to create folder");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[600px] mx-auto mt-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-blue-50 rounded-2xl text-[#1a73e8]">
            <CreateNewFolderIcon className="text-3xl" />
          </div>
          <Typography variant="h5" className="font-extrabold text-slate-800">
            Create New Folder
          </Typography>
        </div>

        <div className="space-y-8">
          <TextField
            label="Folder name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Project Assets, Learning"
            className="[&_.MuiOutlinedInput-root]:rounded-xl"
            autoFocus
          />

          <div className="flex gap-4">
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<CreateNewFolderIcon />}
              onClick={handleCreate}
              className="bg-[#1a73e8] hover:bg-[#1557b0] shadow-none font-bold normal-case py-4 rounded-xl text-lg flex-1"
            >
              Create Folder
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/dashboard/snippets")}
              className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none font-bold normal-case py-4 rounded-xl text-lg flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
