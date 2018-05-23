const version = process.env.npm_package_version;
console.log("Zipping Version:", "\x1b[32m", version);
// require modules
const fs = require("fs-extra");
const archiver = require("archiver");

// create a file to stream archive data to.
const output = fs.createWriteStream(`./release/defendVersion${version}.zip`);
const archive = archiver("zip", {
  zlib: { level: 6 } // Sets the compression level.
});

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on("close", () => {
  const total = archive.pointer();

  const MB = total * 0.000001;

  console.log(`Total: ${MB} MB`);
});

// pipe archive data to the file
archive.pipe(output);

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on("warning", err => {
  if (err.code === "ENOENT") {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

archive.on("error", err => {
  throw err;
});

archive.on("finish", () => {
  fs.remove("./dist/release/", error => {
    Error(error);
  });

  fs.copy(
    `./release/defendVersion${version}.zip`,
    `./dist/release/defendVersion${version}.zip`,
    err => Error(err)
  );
});

// append files from a sub-directory, putting its contents at the root of archive
archive.directory("./dist", false);

// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize();
