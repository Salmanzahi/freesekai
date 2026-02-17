/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ebwcyrfagheqvsmrfzlm.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      }
    ],
  },
};

module.exports = nextConfig;
