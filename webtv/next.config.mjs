/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  output: "export",
};

if(isProd) {
  nextConfig.assetPrefix = "./"
}

export default nextConfig;
