module.exports = {
  plugins: [
    require("precss"),
    require("cssnano")({
      autoprefixer: false,
      discardComments: { removeAll: true },
      preset: "advanced"
    }),
    require("autoprefixer")
  ]
};
