import config from "@app/eslint-config";

export default [
  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/node_modules/**",
      "**/.docker-data/**",
    ],
  },
  ...config,
];
