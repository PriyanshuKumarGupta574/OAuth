import { Typography, Link, IconButton, TextField, Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function Footer() {
  return (
    <div className="bg-[#f8fafc] border-t border-[#e2e8f0] pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <Typography variant="h6" className="font-bold text-[#1a73e8] mb-4">
              SnippetManager
            </Typography>
            <Typography variant="body2" color="text.secondary" className="mb-4">
              The best place to store, organize, and share your code snippets with your team. Secure, fast, and collaborative.
            </Typography>
            <div className="flex flex-row gap-2">
              <IconButton size="small" color="primary"><GitHubIcon /></IconButton>
              <IconButton size="small" color="primary"><TwitterIcon /></IconButton>
              <IconButton size="small" color="primary"><LinkedInIcon /></IconButton>
            </div>
          </div>

          <div className="col-span-1 xs:col-span-6 md:col-span-2">
            <Typography variant="subtitle2" className="font-bold mb-4">
              Product
            </Typography>
            <div className="flex flex-col gap-2">
              <Link href="#" color="text.secondary" underline="hover">Features</Link>
              <Link href="#" color="text.secondary" underline="hover">Teams</Link>
              <Link href="#" color="text.secondary" underline="hover">Integrations</Link>
              <Link href="#" color="text.secondary" underline="hover">Pricing</Link>
            </div>
          </div>

          <div className="col-span-1 xs:col-span-6 md:col-span-2">
            <Typography variant="subtitle2" className="font-bold mb-4">
              Resources
            </Typography>
            <div className="flex flex-col gap-2">
              <Link href="#" color="text.secondary" underline="hover">Documentation</Link>
              <Link href="#" color="text.secondary" underline="hover">API Reference</Link>
              <Link href="#" color="text.secondary" underline="hover">Community</Link>
              <Link href="#" color="text.secondary" underline="hover">Blog</Link>
            </div>
          </div>

          <div className="md:col-span-4">
            <Typography variant="subtitle2" className="font-bold mb-4">
              Stay up to date
            </Typography>
            <Typography variant="body2" color="text.secondary" className="mb-4">
              Subscribe to our newsletter for the latest updates.
            </Typography>
            <form noValidate autoComplete="off" className="flex gap-2">
              <TextField
                size="small"
                placeholder="Enter your email"
                fullWidth
                className="bg-white"
              />
              <Button variant="contained" className="shadow-none bg-[#1a73e8] hover:bg-[#1557b0]">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#e2e8f0] mt-12 pt-6 text-center">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} SnippetManager. All rights reserved. Made with love.
          </Typography>
        </div>
      </div>
    </div>
  );
}
