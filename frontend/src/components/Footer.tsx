import { Box, Container, Grid, Typography, Link, IconButton, Stack, TextField, Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "#f8fafc",
        borderTop: "1px solid #e2e8f0",
        pt: 6,
        pb: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
              SnippetManager
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              The best place to store, organize, and share your code snippets with your team. Secure, fast, and collaborative.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" color="primary"><GitHubIcon /></IconButton>
              <IconButton size="small" color="primary"><TwitterIcon /></IconButton>
              <IconButton size="small" color="primary"><LinkedInIcon /></IconButton>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} mb={2}>
              Product
            </Typography>
            <Stack spacing={1}>
              <Link href="#" color="text.secondary" underline="hover">Features</Link>
              <Link href="#" color="text.secondary" underline="hover">Teams</Link>
              <Link href="#" color="text.secondary" underline="hover">Integrations</Link>
              <Link href="#" color="text.secondary" underline="hover">Pricing</Link>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} mb={2}>
              Resources
            </Typography>
            <Stack spacing={1}>
              <Link href="#" color="text.secondary" underline="hover">Documentation</Link>
              <Link href="#" color="text.secondary" underline="hover">API Reference</Link>
              <Link href="#" color="text.secondary" underline="hover">Community</Link>
              <Link href="#" color="text.secondary" underline="hover">Blog</Link>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" fontWeight={700} mb={2}>
              Stay up to date
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Subscribe to our newsletter for the latest updates.
            </Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Enter your email"
                fullWidth
                sx={{ bgcolor: 'white' }}
              />
              <Button variant="contained" disableElevation>
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: "1px solid #e2e8f0", mt: 6, pt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} SnippetManager. All rights reserved. Made with.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
