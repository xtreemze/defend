const fsExtra = require("fs-extra");

fsExtra.remove("./node_modules", error => {
  Error(error);
});
