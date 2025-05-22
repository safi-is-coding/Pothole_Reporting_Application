// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['bbde-2405-201-a41d-601c-9bb-63c2-8b56-bc6d.ngrok-free.app'],
  },
});
