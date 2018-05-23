import M from "materialize-css";

const e = "e";

const manifest = require(`./../../manif${e}st.json`);

export default async function version() {
  const versionDom = document.getElementById("version");

  versionDom.addEventListener("click", async () => {
    const versionNumber = `Version: ${manifest.version}`;
    M.Toast.dismissAll();
    M.toast({
      html: versionNumber
    });
  });
}
