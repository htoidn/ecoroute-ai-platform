import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
    // Load env vars based on mode (so VITE_BASE can be provided)
    const env = loadEnv(mode, process.cwd(), '')

    // VITE_BASE can be set when building for GitHub Pages (e.g. '/ecoroute-ai-platform/')
    // Default to '/' which is appropriate when serving at root (nginx/Docker)
    const base = env.VITE_BASE || '/'

    return defineConfig({
        base,
        plugins: [react()],
        server: {
            port: 3000,
        },
    })
}
