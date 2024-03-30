/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Important: return the modified config
    return {
      ...config,
      externals: {
        'pkcs11js': 'require("pkcs11js")',
      }
    }
  }
};

export default nextConfig;
