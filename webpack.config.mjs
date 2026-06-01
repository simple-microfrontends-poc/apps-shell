import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { ModuleFederationPlugin } from "@module-federation/enhanced/webpack";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const deps = require("./package.json").dependencies;

export default {
  entry: "./src/main.tsx",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    clean: true,
    publicPath: "http://localhost:3000/",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader",
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
        products: "products@http://localhost:3001/remoteEntry.js",
        categories: "categories@http://localhost:3002/remoteEntry.js",
        productPage: "productPage@http://localhost:3004/remoteEntry.js",
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
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
};
