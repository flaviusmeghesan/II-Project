// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vitejs.dev/config/
// export default defineConfig({ 
//   server:{
//     proxy:{
//       '/api':{
//         target: 'http://localhost:3000',
//         secure: false,
//       },
//     },
//   },
//   plugins: [react()],
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env file from the root directory
config({ path: resolve(__dirname, '..', '.env') });
console.log('VITE_FIREBASE_API_KEY:', process.env.VITE_FIREBASE_API_KEY);


// https://vitejs.dev/config/
export default defineConfig({ 
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react()],
});
