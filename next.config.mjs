/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import pkg from "./next-i18next.config.js";
import { env } from "./src/env.mjs";
const { i18n } = pkg;
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  output: "standalone",
  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
    };

    return config;
  },
  images: {
    domains: [
      // for showing avatar images from google account
      "lh3.googleusercontent.com",
      // for S3 stored images
      env.S3_ENDPOINT,
      "localhost",
    ],
    remotePatterns: [
      // for showing images generated by openai
      {
        hostname: "*.blob.core.windows.net",
        protocol: "https",
        pathname: "/**/*",
        port: "",
      },
    ],
  },
};

export default config;
