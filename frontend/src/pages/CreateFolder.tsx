import { useState } from "react";
import { Box, Card, Typography, TextField, Button, Stack } from "@mui/material";
import { toast } from "react-toastify";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DashboardLayout from "../layout/DashboardLayout";
import { createFolder } from "../services/folder.service";
import { useNavigate } from "react-router-dom";

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
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <Card sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <CreateNewFolderIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight={700}>
              Create New Folder
            </Typography>
          </Stack>

          <TextField
            label="Folder name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<CreateNewFolderIcon />}
            onClick={handleCreate}
            sx={{ borderRadius: "10px", py: 1.5, fontWeight: 700 }}
          >
            Create Folder
          </Button>
        </Card>
      </Box>
    </DashboardLayout>
  );
}


