const lequinoxLogo = require(/* webpackPreload: true */ "./../../img/Lequinox_logo.svg");

export default function footerContentGenerator(content) {
  return /* html */ `<div class="container">
  <div class="row">
    <div class="col l3 m4 s6 hide-on-small-only show-on-medium-and-up">

      <img src="${lequinoxLogo}" alt="Lequinox" class="responsive-img logo" style="padding-top:1.7rem">
      <br>
      <br>
      <br>
      <br>
    </div>
    <div class="col l6 m8 s12 center">
      <h4 class="white-text">${content.footers1i1}</h4>
      <p class="grey-text text-lighten-4">${content.footers1i2}</p>
      <br>
      <br>
      <form id="contactForm" class="white-text" action="">
        <div class="row">
          <div class="col l6 m12 s12">
            <div class="row">
              <div class="input-field col s12 reveal">
                <input type="text" name="name" id="nameInput" autocomplete="name" class="validate white-text contactField" required="" minlength="3"
                  maxlength="80" data-length="80">
                <label for="nameInput" class="">Name</label>
                <span class="helper-text" data-error="Please provide your name. Minimum: 3 & Maximum: 80 characters." data-success="Welcome!"></span>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12 reveal">

                <input type="email" name="email" id="emailInput" autocomplete="email" class="validate white-text contactField" required=""
                  minlength="6" maxlength="80" data-length="80">
                <label for="emailInput" class="">${content.footers1i4}</label>
                <span class="helper-text" data-error="Please provide a valid email address. Minimum: 6 & Maximum: 80 characters." data-success=""></span>
              </div>
            </div>

          </div>
          <div class="col l6 m12 s12 reveal">
            <div class="input-field">
              <textarea id="messageInput" class="validate materialize-textarea white-text messageField contactField" required="" minlength="20"
                maxlength="800" data-length="800"></textarea>
              <label class="contactField" for="messageInput">${
                content.footers1i5
              }
              </label>
              <span class="helper-text" data-error="Please describe your use case." data-success="Thank you for your interest in Lequinox."></span>
            </div>
            <br>
            <a id="sendButton" class="emailLink btn white lightBtn col s12">${
              content.footers1i6
            }
            </a>
          </div>

        </div>

      </form>
    </div>

  </div>
</div>
<div id="version" class="footer-copyright">
  <div class="container">
    <p class="center">
      ${content.footers1i3}
    </p>
  </div>
</div>
`;
}
