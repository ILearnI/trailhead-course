/** @type {import('next').NextConfig} */
const config = {
  // Plain files, no server
  output: "export",
  // The image server needs a server
  images: { unoptimized: true },
};

export default config;
