import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { ModuleFederationPlugin } from "@module-federation/enhanced/webpack";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const deps = require("./package.json").dependencies;

// Load .env files into process.env (Node 20.12+ native, zero-dependency).
// File selection: APP_ENV picks the target explicitly and independently of the
// webpack --mode (e.g. APP_ENV=prod -> .env.prod, still a minified build);
// without APP_ENV it falls back to the build mode (development | production).
// Precedence (first match wins; a real shell env var always beats the files):
//   .env.<sel>.local > .env.<sel> > .env.local > .env
// Missing files are ignored. Documented variables live in .env.example;
// the actual files are gitignored.
function loadEnv(mode) {
  const sel = process.env.APP_ENV ?? mode;
  for (const file of [`.env.${sel}.local`, `.env.${sel}`, ".env.local", ".env"]) {
    try {
      process.loadEnvFile(path.join(__dirname, file));
    } catch {
      /* file absent — ignore */
    }
  }
}

export default (_env, argv) => {
  const mode = argv.mode ?? "production";
  loadEnv(mode);

  // publicPath must end with "/", else webpack concatenates chunk names straight
  // onto it (e.g. "http://example.com" + "main.js" -> "http://example.commain.js").
  const publicPath = (process.env.PUBLIC_PATH ?? "http://localhost:3000/").replace(/\/*$/, "/");

  // `name@url` remote entry; URL from env, dev localhost as fallback.
  const remote = (name, envVar, fallback) =>
    `${name}@${process.env[envVar] ?? fallback}`;

  return {
    entry: "./src/main.tsx",
    // Minified prod bundle (no maps); readable dev bundle with real source maps.
    devtool: mode === "development" ? "source-map" : false,
    output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].[contenthash].js",
      clean: true,
      publicPath,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            // Bundle build doesn't need .d.ts/.d.ts.map (host exposes nothing,
            // remotes use hand-written types.d.ts). tsconfig keeps declarations
            // on for the editor; this only suppresses them during the build.
            options: { compilerOptions: { declaration: false, declarationMap: false } },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@": path.join(__dirname, "src"),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new ModuleFederationPlugin({
        name: "shell",
        remotes: {
          products: remote("products", "REMOTE_PRODUCTS_URL", "http://localhost:3001/remoteEntry.js"),
          categories: remote("categories", "REMOTE_CATEGORIES_URL", "http://localhost:3002/remoteEntry.js"),
          productPage: remote("productPage", "REMOTE_PRODUCTPAGE_URL", "http://localhost:3004/remoteEntry.js"),
        },
        shared: {
          react: { singleton: true, requiredVersion: deps.react },
          "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
          // Singleton event bus — without this each MFE bundles its own mitt()
          // instance and events never cross the federation boundary.
          "@admin/event-bus": { singleton: true, requiredVersion: false },
          // Singleton router — shell owns the single <BrowserRouter>; remotes that
          // add their own routes must share this same instance (one history/context).
          // `react-router` (core) holds the Router contexts, so it must be a
          // singleton too — otherwise a remote can't see the host's <BrowserRouter>.
          "react-router-dom": { singleton: true, requiredVersion: deps["react-router-dom"] },
          "react-router": { singleton: true, requiredVersion: false },
        },
        dts: false,
      }),
    ],
    devServer: {
      port: Number(process.env.DEV_PORT ?? 3000),
      hot: true,
      historyApiFallback: true,
    },
  };
};
