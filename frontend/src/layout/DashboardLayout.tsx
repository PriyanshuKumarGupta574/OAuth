// Migrated to Tailwind CSS
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FolderSidebar from "../components/FolderSidebar";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <FolderSidebar />

        <div className="flex-1 px-4 md:px-10 py-8 max-w-[1400px] mx-auto w-full overflow-y-auto">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}


