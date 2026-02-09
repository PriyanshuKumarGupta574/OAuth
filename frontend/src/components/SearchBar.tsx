import { useState } from "react";
import {
    TextField,
    MenuItem,
    Button,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

import type { SnippetFilters } from "../types";

interface SearchBarProps {
    onSearch: (filters: SnippetFilters) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [search, setSearch] = useState("");
    const [language, setLanguage] = useState("");
    const [tag, setTag] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = () => {
        onSearch({
            search,
            language,
            tag,
            startDate,
            endDate,
            page: 1,
        });
    };

    const clearFilters = () => {
        setSearch("");
        setLanguage("");
        setTag("");
        setStartDate("");
        setEndDate("");
        onSearch({ page: 1 });
    };

    return (
        <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <TextField
                    fullWidth
                    label="Search snippets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleSearch}
                    className="min-w-[120px] bg-[#1a73e8] hover:bg-[#1557b0] shadow-none font-bold"
                >
                    Search
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => setShowFilters(!showFilters)}
                    startIcon={<FilterListIcon />}
                    className="min-w-[120px]"
                >
                    Filters
                </Button>
            </div>

            {showFilters && (
                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <TextField
                            select
                            label="Language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            fullWidth
                        >
                            {[
                                "javascript",
                                "typescript",
                                "python",
                                "java",
                                "cpp",
                                "csharp",
                                "go",
                                "rust",
                                "php",
                            ].map((lang) => (
                                <MenuItem key={lang} value={lang}>
                                    {lang}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Tag"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            fullWidth
                        />

                        <TextField
                            type="date"
                            label="Start Date"
                            InputLabelProps={{ shrink: true }}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            fullWidth
                        />

                        <TextField
                            type="date"
                            label="End Date"
                            InputLabelProps={{ shrink: true }}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            fullWidth
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button color="error" onClick={clearFilters} className="font-semibold">
                            Clear All Filters
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
