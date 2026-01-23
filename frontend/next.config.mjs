/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.hyperformancesolutions.com",
                pathname: "/**",
            },
        ],
    },
}

export default nextConfig;
