const packageName = process.env.npm_package_name;
const version = process.env.npm_package_version;

console.log(packageName + " Version:", "\x1b[32m", version, "\033[0m");
