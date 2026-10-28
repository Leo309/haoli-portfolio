// eslint-config-next 16 ships native flat configs, so FlatCompat is no longer needed
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts", "private/**", ".superpowers/**"],
  },
];

export default eslintConfig;
