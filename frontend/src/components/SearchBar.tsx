import { useState, useEffect } from "react";
import {
    Box,
    TextField,
    MenuItem,
    Button,
    Stack,
    Autocomplete,
    Chip,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

interface SearchBarProps {
    onSearch: (filters: any) => void;
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
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
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
                    sx={{ minWidth: 100 }}
                >
                    Search
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => setShowFilters(!showFilters)}
                    startIcon={<FilterListIcon />}
                >
                    Filters
                </Button>
            </Box>

            {showFilters && (
                <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1, boxShadow: 1 }}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
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
                    </Stack>

                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button color="error" onClick={clearFilters}>
                            Clear All Filters
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
