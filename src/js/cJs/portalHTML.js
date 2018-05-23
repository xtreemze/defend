const image1 = require(/* webpackPrefetch: true */ "./../../img/portal/pcp_1.jpg");
const image2 = require(/* webpackPrefetch: true */ "./../../img/portal/pcp_2.jpg");
const image3 = require(/* webpackPrefetch: true */ "./../../img/portal/pcp_3.jpg");

export default function portalContentGenerator(content) {
  return `<div id="index-banner" class="parallax-container banner">
  <div class="no-pad-bot">
    <div class="container white-text">
      <div class="valign-wrapper no-pad-top no-pad-bot center-align bannerTitle">

        <h1 class="text-lighten-2 padUp">
          Customer Portal</h1>
      </div>
    </div>
  </div>
  <div class="parallax">
    <img src="${image1}" alt="customer Portal" style="transform: translate3d(-50%, 0px, 0px); opacity: 1;" class="parallaxImg fIn">
  </div>

</div>

<section class="section">
<div class="container">
  <div class="row">
    <div class="col s12 m6 l6">
      <div class="card">
        <div class="card-image">
          <img src="${image2}">
          </div>
          <div class="card-content no-pad-top">
          <h3 class="">Service Desk</h3>
          <p>Welcome to the Lequa Service Desk. Log in to raise a question, report and error, or suggest an improvement. You can also get access to Beta software.</p>

        <br>
        <a href="https://help.lequa.com/quick-guide/" target="_blank" rel="noopener" class="btn lightBtn white">Quick Guides</a>
        <br>
        <br>
        <a href="https://help.lequa.com" target="_blank" rel="noopener" class="btn lightBtn white">Framework Application Manuals</a>
        <br>
        <br>
        <a href="https://help.lequa.com/lequinoxconsole" target="_blank" rel="noopener" class="btn lightBtn white">Lequinox Console Manual</a>
        <br>
        <br>
        <a href="https://support.lequinox.com/" target="_blank" rel="noopener" class="btn lightBtn white">Service Desk</a>
        <br>
        </div>

      </div>
    </div>

    <div class="col s12 m6 l6">
      <div class="card">
        <div class="card-image">
          <img src="${image3}">
          </div>
          <div class="card-content no-pad-top">
          <h3 class="">Developer Area</h3>
          <p>Empower your applications with Lequinox&trade; platform. In the Developer area, you can find help for getting started, get acces to Lequinox API's, and read set-up and installation guides.</p>

        <br>
        <a href="https://developer.lequinox.com/" target="_blank" rel="noopener" class="btn lightBtn white">Go to page</a>
        <br>
        <br>

        </div>

      </div>
    </div>


  </div>
</div>
</section>`;
}
