import packageJson from "./package.json";

// plugins
import { nodeResolve } from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import dts from "rollup-plugin-dts";

const base = {
  input: "src/main.ts",
  plugins: [
    nodeResolve(),
    esbuild({
      include: /\.[jt]sx?$/,
      exclude: /node_modules/,
      sourceMap: false,
      minify: true,
      target: "es2017",
    }),
  ],
};

export default [
  {
    // generate type file, and type-checking
    input: "src/types.d.ts",
    output: [{ file: "dist/types.d.ts", format: "es" }],
    plugins: [dts()],
  },
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
