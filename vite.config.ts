import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    return {
        plugins: [
            laravel({
                input: ['src/index.css', 'src/main.tsx'],
                refresh: true,
            }),
            react(),
            tailwindcss(),
        ],
        define: {
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        },
        server: {
            hmr: process.env.DISABLE_HMR !== 'true',
        },
    };
});
