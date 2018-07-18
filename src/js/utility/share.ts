import { economyGlobals } from "../main/globalVariables";
import { installButtonStyle } from "../gui/startHTML";

function share() {
  var text = `Victories: ${economyGlobals.victories}/${economyGlobals.defeats}`;

  if ("share" in navigator) {
    //@ts-ignore
    navigator.share({
      title: "Defend - Mobile 3D Tower Defense",
      text: text,
      url: location.href
    });
  } else {
    // Here we use the WhatsApp API as fallback; remember to encode your text for URI
    location.href =
      "https://api.whatsapp.com/send?text=" +
      encodeURIComponent(`3D Tower Defense - ` + text + " - ") +
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
