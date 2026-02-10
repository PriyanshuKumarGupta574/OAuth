import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import {
    Box,
    Typography,
    Button,
    Container,
    Paper,
    useTheme,
    alpha
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

const FallbackUI = ({ error }: { error?: Error }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                p: 3,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        textAlign: "center",
                        borderRadius: "24px",
                        background: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: "blur(20px)",
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
                        animation: "fadeIn 0.6s ease-out",
                        "@keyframes fadeIn": {
                            from: { opacity: 0, transform: "translateY(20px)" },
                            to: { opacity: 1, transform: "translateY(0)" },
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "inline-flex",
                            p: 2,
                            borderRadius: "20px",
                            background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`,
                            color: "white",
                            mb: 3,
                            boxShadow: `0 10px 20px ${alpha(theme.palette.error.main, 0.3)}`,
                        }}
                    >
                        <ErrorOutlineIcon sx={{ fontSize: 48 }} />
                    </Box>

                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
                        Oops! Something went wrong
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                        The application encountered an unexpected error. Don't worry, your data is safe.
                        Try reloading the page to get back on track.
                    </Typography>

                    {import.meta.env.DEV && error && (
                        <Box
                            sx={{
                                mb: 4,
                                p: 2,
                                borderRadius: "12px",
                                bgcolor: alpha(theme.palette.error.main, 0.05),
                                border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                                textAlign: "left",
                                maxHeight: "200px",
                                overflow: "auto",
                            }}
                        >
                            <Typography variant="caption" sx={{ fontFamily: "monospace", color: theme.palette.error.main }}>
                                {error.toString()}
                            </Typography>
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<RefreshIcon />}
                        onClick={() => window.location.reload()}
                        sx={{
                            py: 1.5,
                            px: 4,
                            borderRadius: "12px",
                            fontSize: "1.1rem",
                            textTransform: "none",
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                            "&:hover": {
                                boxShadow: `0 15px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                            },
                        }}
                    >
                        Reload Page
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <FallbackUI error={this.state.error} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
