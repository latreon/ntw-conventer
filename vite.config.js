// vite.config.js - Example for using with ntw-conventer
import { defineConfig } from 'vite';

export default defineConfig({
    optimizeDeps: {
        include: ['ntw-conventer']
    },
    build: {
        commonjsOptions: {
            include: [/ntw-conventer/]
        }
    }
}); 