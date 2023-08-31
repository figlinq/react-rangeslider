const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const path = require("path");
const webpack = require("webpack");

const config = {
  devtool: "eval-source-map",

  entry:
    process.env.NODE_ENV === "development"
      ? [
          "webpack-hot-middleware/client?http://localhost:3000",
          path.join(__dirname, "index"),
        ]
      : path.join(__dirname, "index"),

  output: {
    path:
      process.env.NODE_ENV === "development"
        ? __dirname
        : path.join(__dirname, "public"),
    publicPath:
      process.env.NODE_ENV === "development"
        ? path.join(__dirname, "/static/")
        : "",
    filename: "bundle.js",
  },

  resolve: {
    extensions: [".js", ".css", ".less"],
    alias: {
      "react-rangeslider": path.join(__dirname, "../src/index.js"),
    },
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: ["last 2 versions"],
                  },
                },
              ],
              // '@babel/preset-env', // https://goo.gl/aAxYAq
              "@babel/preset-react", // https://goo.gl/4aEFV3
            ],

            // https://goo.gl/N9gaqc - List of Babel plugins.
            plugins: [
              "@babel/plugin-proposal-object-rest-spread", // https://goo.gl/LCHWnP
              "@babel/plugin-proposal-class-properties", // https://goo.gl/TE6TyG
            ],
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: "style!css",
      },
      {
        test: /\.txt$/,
        exclude: /node_modules/,
        loader: "raw",
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: "url-loader",
        options: {
          limit: 25000,
        },
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: { importLoaders: 1 },
            },
            {
              loader: "postcss-loader",
              options: {
                plugins: () => [autoprefixer],
              },
            },
            {
              loader: "less-loader",
            },
          ],
        }),
      },
    ],
  },

  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "react-ga": "ReactGA",
  },

  plugins: [],
};

// Dev config
if (process.env.NODE_ENV === "development") {
  config.plugins = [
    ...config.plugins,
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ];
}

// Build config
if (process.env.NODE_ENV === "production") {
  config.optimization = {
    minimize: true,
  };
  config.plugins = [
    ...config.plugins,
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new ExtractTextPlugin("bundle.css"),
    new HtmlPlugin({
      appMountId: "mount",
      title: "React RangeSlider",
      template: "docs/index.ejs",
    }),
  ];
}

module.exports = config;
