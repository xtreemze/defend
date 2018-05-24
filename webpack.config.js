// const OfflinePlugin = require("offline-plugin");
// const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlMinifierPlugin = require("html-minifier-webpack-plugin");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const PreloadWebpackPlugin = require("preload-webpack-plugin");

module.exports = function e(env, argv) {
  console.log(argv.mode);
  return {
    entry: {
      shell: ["./src/js/main/start.js"],
      babylon: "babylonjs",
      shims: "airbnb-browser-shims"
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          common: {
            minChunks: 3,
            chunks: "all",
            reuseExistingChunk: true
          }
        }
      }
    },
    devtool: "source-map",
    output: {
      path: `${__dirname}/dist`,
      filename: "./js/[name].js",
      chunkFilename: "./js/[id].js"
    },
    cache: true,
    devServer: { contentBase: "./dist", compress: true, hot: true },
    stats: {
      // Add asset Information
      assets: true,

      // Add information about cached (not built) modules
      cached: false,

      // Show cached assets (setting this to `false` only shows emitted files)
      cachedAssets: false,

      // Add children information
      children: false,

      // Add chunk information (setting this to `false` allows for a less verbose output)
      chunks: false,

      // Add built modules information to chunk information
      chunkModules: false,

      // Add the origins of chunks and chunk merging info
      chunkOrigins: false,

      // `webpack --colors` equivalent
      colors: true,

      // Display the distance from the entry point for each module
      depth: false,

      // Display the entry points with the corresponding bundles
      entrypoints: false,

      // Add --env information
      env: false,

      // Add errors
      errors: true,

      // Add details to errors (like resolving log)
      errorDetails: true,

      // Add the hash of the compilation
      hash: false,

      // Set the maximum number of modules to be shown
      maxModules: 15,

      // Add built modules information
      modules: false,

      // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
      moduleTrace: false,

      // Show performance hint when file size exceeds `performance.maxAssetSize`
      performance: true,

      // Show the exports of the modules
      providedExports: false,

      // Add public path information
      publicPath: false,

      // Add information about the reasons why modules are included
      reasons: false,

      // Add the source code of modules
      source: false,

      // Add timing information
      timings: false,

      // Show which exports of a module are used
      usedExports: false,

      // Add webpack version information
      version: true,

      // Add warnings
      warnings: false
    },
    module: {
      rules: [
        {
          test: /\.(scss|sass|css)$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                minimize: false,
                sourceMap: false,
                importLoaders: 1
              }
            },
            "postcss-loader",
            { loader: "sass-loader" }
          ]
        },
        {
          test: /\.(ttf|otf)$/,
          use: ["file-loader?name=./assets/[name].[ext]"]
        },
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          loader: "babel-loader",
          query: {
            presets: [
              [
                "airbnb",
                {
                  targets: {
                    browsers: ["last 1 versions", "> 1%"]
                  },
                  modules: false
                }
              ]
            ]
          }
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          loaders: [
            "file-loader?name=./assets/[name].[ext]",
            {
              loader: "image-webpack-loader"
            }
          ]
        }
      ]
    },
    plugins: [
      // new UglifyJSPlugin({
      //   uglifyOptions: {
      //     cache: true,
      //     parallel: true,
      //     sourceMap: true,
      //     compress: {
      //       unsafe: true,
      //       unsafe_comps: true,
      //       unsafe_Function: true
      //     },
      //     mangle: {},
      //     ecma: 8,
      //     output: {
      //       comments: false
      //     }
      //   }
      // }),
      new HtmlWebpackPlugin({
        template: "./src/index.ejs"
      })
      // new HtmlMinifierPlugin({
      //   minifyCSS: true,
      //   minifyJS: true,
      //   removeComments: true,
      //   removeEmptyAttributes: true,
      //   removeEmtpyElements: false,
      //   removeOptionalTags: true,
      //   removeRedundantAttributes: true,
      //   useShortDoctype: true,
      //   removeStyleLinkTypeAttributes: true,
      //   sortAttributes: true,
      //   sortClassName: true,
      //   minifyURLs: true,
      //   collapseWhitespace: true,
      //   collapseInlineTagWhitespace: true,
      //   collapseBooleanAttributes: true
      // })

      // new OfflinePlugin({
      //   externals: [],
      //   caches: "all",
      //   responseStrategy: "network-first",
      //   updateStrategy: "all",
      //   minify: "true",
      //   autoUpdate: 1000 * 60 * 60 * 2,
      //   ServiceWorker: {
      //     events: "true"
      //   },
      //   AppCache: {
      //     events: "true"
      //   }
      // })
    ]
  };
};
