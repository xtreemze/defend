import { economyGlobals } from "../main/globalVariables";
import { installButtonStyle } from "../gui/startHTML";

function share() {
  const title = "Defend - 3D Tower Defense by @xtreemze";
  const text = `Victories: ${economyGlobals.victories}/${
    economyGlobals.defeats
  }`;

  if ("share" in navigator) {
    //@ts-ignore
    navigator.share({
      title: title,
      text: text,
      url: location.href
    });
  } else {
    // Here we use the WhatsApp API as fallback; remember to encode your text for URI
    location.href =
      "https://api.whatsapp.com/send?text=" +
      encodeURIComponent(`${title} - ` + text + " - ") +
      location.href;
  }
}

function shareButton() {
  // build share button
  const shareBtn = document.createElement("button") as HTMLButtonElement;
  shareBtn.id = "shareBtn";
  shareBtn.innerHTML = "&#128279;";
  shareBtn.setAttribute("style", installButtonStyle);

  // show share button
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
  const canvasParent = canvas.parentNode as Node;
  canvasParent.insertBefore(shareBtn, canvas);

  shareBtn.addEventListener("click", () => {
    share();
  });
}

function removeShareButton() {
  const shareBtn = document.getElementById("shareBtn") as HTMLButtonElement;
  const shareBtnParent = shareBtn.parentNode as Node;
  shareBtnParent.removeChild(shareBtn);
}

export { share, shareButton, removeShareButton };
