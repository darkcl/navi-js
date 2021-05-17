import packageJson from "./package.json";

// plugins
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const base = {
  input: "src/main.ts",
  plugins: [nodeResolve(), typescript(), terser()],
};

export default [
  {
    ...base,
    output: {
      file: packageJson.main,
      format: "cjs",
      exports: "auto",
    },
  },
  {
    ...base,
    output: {
      file: "dist/es/navi.js",
      format: "es",
    },
  },
  {
    ...base,
    output: {
      file: "dist/umd/navi.js",
      format: "umd",
      name: "ipc",
    },
  },
];
