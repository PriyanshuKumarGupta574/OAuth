import { useState } from "react";
import { Box, Card, Typography, TextField, Button } from "@mui/material";
import DashboardLayout from "../layout/DashboardLayout";
import { createFolder } from "../services/folder.service";
import { useNavigate } from "react-router-dom";

export default function CreateFolder() {
  const [name, setName] = useState("");
  const navigate = useNavigate();   

  const handleCreate = async () => {
    try {
      if (!name) return alert("Folder name required");

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
          <Typography variant="h5" mb={3}>
            Create New Folder
          </Typography>

          <TextField
            label="Folder name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button variant="contained" onClick={handleCreate}>
            Create Folder
          </Button>
        </Card>
      </Box>
    </DashboardLayout>
  );
}


