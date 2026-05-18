import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        {
            // Use Vite's BASE_URL (set at build time) so the router basename matches where the app is hosted.
            // import.meta.env.BASE_URL will be '/' for root hosting and '/ecoroute-ai-platform/' for GH Pages.
        }
        <BrowserRouter
            basename={(() => {
                const base = (import.meta.env.BASE_URL as string) || '/';
                if (base === '/') return '';
                return base.replace(/\/$/, '');
            })()}
        >
            <ThemeProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);