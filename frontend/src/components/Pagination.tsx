import { Button, Typography } from "@mui/material";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="flex justify-center items-center mt-12 gap-6 pb-8">
            <Button
                variant="outlined"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-6 py-2 rounded-lg border-slate-300"
            >
                Prev
            </Button>

            <Typography className="text-slate-600 font-medium whitespace-nowrap">
                Page {currentPage} of {totalPages}
            </Typography>

            <Button
                variant="outlined"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-6 py-2 rounded-lg border-slate-300"
            >
                Next
            </Button>
        </div>
    );
}
