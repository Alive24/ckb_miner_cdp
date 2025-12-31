/** @type {import('next').NextConfig} */
import nextra from "nextra";

const withNextra = nextra({
  contentDirBasePath: "/docs",
});

export default withNextra({
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      // Path to your mdx-components file with extension
      "next-mdx-import-source-file": "./mdx-components.ts",
    },
  },
});
