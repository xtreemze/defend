const fsExtra = require("fs-extra");

fsExtra.remove("./dist/", error => {
  Error(error);
});
