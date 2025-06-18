import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5181 // Portun backend CORS-a uyğun olmalıdır
  }
});
