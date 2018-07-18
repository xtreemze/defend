const HtmlWebpackPlugin = require("html-webpack-plugin");
const OfflinePlugin = require("offline-plugin");
// const HtmlMinifierPlugin = require("html-minifier-webpack-plugin");

module.exports = function e() {
  return {
    entry: {
      sw: "./src/js/main/registerServiceWorker.ts",
      offline: "./src/js/main/offlineRuntime.ts",
      shims: "airbnb-browser-shims",
      shell: "./src/js/main/Game.ts"
    },
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          common: {
            minChunks: 2,
            chunks: "all",
            reuseExistingChunk: true
          }
        }
      }
    },
    devtool: "eval-source-map",
    output: {
      path: `${__dirname}/dist`,
      filename: "./js/[name].js",
      chunkFilename: "./js/[id].js"
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    cache: true,
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
          test: /\.js$/,
          exclude: [/node_modules/],
          include: `${__dirname}/src`,
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
          test: /\.(ts|tsx)?$/,
          use: "ts-loader",
          exclude: /node_modules/
          // include: `${__dirname}/src`
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.ejs"
      }),
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
      // }),
      new OfflinePlugin({
        // externals: [],
        caches: "all",
        responseStrategy: "network-first",
        updateStrategy: "all",
        minify: "true",
        ServiceWorker: {
          events: "true"
        }
        // ,
        // AppCache: {
        //   events: "true"
        // }
      })
    ]
  };
};
