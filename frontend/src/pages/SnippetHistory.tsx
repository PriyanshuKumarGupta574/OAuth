import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, Typography, Button } from "@mui/material";
import DashboardLayout from "../layout/DashboardLayout";
import {
  getSnippetHistory,
  restoreSnippetVersion,
} from "../services/snippet.service";

type Version = {
  _id: string;
  code: string;
  editedAt: string; // 🔥 backend sends editedAt, not createdAt
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
      alert("Version restored");
    } catch (err) {
      console.error(err);
      alert("Restore failed");
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
        <Typography variant="h4" mb={3}>
          Version History
        </Typography>

        {history.map((v) => (
          <Card key={v._id} sx={{ p: 3, mb: 2 }}>
            {/* FIX invalid date */}
            <Typography variant="caption">
              {new Date(v.editedAt).toLocaleString()}
            </Typography>

            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={() => restore(v._id)}
            >
              Restore Version
            </Button>
          </Card>
        ))}
      </Box>
    </DashboardLayout>
  );
}


// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Box, Card, Typography, Button } from "@mui/material";
// import DashboardLayout from "../layout/DashboardLayout";
// import {
//   getSnippetHistory,
//   restoreSnippetVersion,
// } from "../services/snippet.service";

// type Version = {
//   _id: string;
//   code: string;
//   createdAt: string;
// };

// export default function SnippetHistory() {
//   const { id } = useParams();
//   const [history, setHistory] = useState<Version[]>([]);

//   useEffect(() => {
//     if (id) {
//       getSnippetHistory(id).then((res) => setHistory(res.data));
//     }
//   }, [id]);

//   const restore = async (versionId: string) => {
//     await restoreSnippetVersion(versionId);
//     alert("Version restored");
//   };

//   return (
//     <DashboardLayout>
//       <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
//         <Typography variant="h4" mb={3}>
//           Version History
//         </Typography>

//         {history.map((v) => (
//           <Card sx={{ p: 3, mb: 2 }}>
//             <Typography variant="caption">
//               {new Date(v.createdAt).toLocaleString()}
//             </Typography>

//             <Button
//               variant="outlined"
//               sx={{ mt: 1 }}
//               onClick={() => restore(v._id)}
//             >
//               Restore Version
//             </Button>
//           </Card>
//         ))}
//       </Box>
//     </DashboardLayout>
//   );
// }
