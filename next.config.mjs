/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "randomuser.me"
            },
            {
                // Fotos do site (licença Unsplash: uso comercial livre, sem atribuição obrigatória)
                protocol: "https",
                hostname: "images.unsplash.com"
            }
        ]
    },
};

export default nextConfig;
