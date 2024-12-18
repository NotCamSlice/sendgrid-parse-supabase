/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Enables strict mode for React
    swcMinify: true,       // Use SWC for faster minification
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL,       // Pass SUPABASE_URL to the client
      SUPABASE_KEY: process.env.SUPABASE_KEY,       // Pass SUPABASE_KEY to the client
      WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,   // Pass WEBHOOK_SECRET to the client
    },
    experimental: {
      runtime: 'edge', // Enable experimental Edge Runtime for Edge API routes
    },
};
  
module.exports = nextConfig;
  