const m = "m";
const cloud28White = require(/* webpackPreload: true */ `./../../i${m}g/cloud28White.png`);
const banner = require(/* webpackPreload: true */ `./../../i${m}g/p1/Photos/1_1.jpg`);
const diagram = require(/* webpackPreload: true */ `./../../i${m}g/p1/Graphics/graphic_1_1.svg`);
const apps = require(/* webpackPreload: true */ `./../../i${m}g/p1/Photos/1_3.jpg`);

const icon1 = require(/* webpackPreload: true */ `./../../i${m}g/p1/Icons/1_1.svg`);
const icon2 = require(/* webpackPreload: true */ `./../../i${m}g/p1/Icons/1_3.svg`);
const icon3 = require(/* webpackPreload: true */ `./../../i${m}g/p1/Icons/1_4.svg`);

export default function p1ContentGenerator(content) {
  return /* html */ `<div id="index-banner" class="parallax-container banner">
  <div class="no-pad-bot">
    <div class="container white-text">
      <div class="valign-wrapper no-pad-top no-pad-bot center-align bannerTitle">

        <h1 class="text-lighten-2 padUp">
          CYBER-RESILIENCE ON-THE-GO FOR THE PROGRAMMABLE ENTERPRISE</h1>
      </div>
    </div>
  </div>
  <div class="parallax">
    <img src="${banner}" alt="Lequinox Platform" style="transform: translate3d(-50%, 0px, 0px);" class="parallaxImg fIn">
  </div>

</div>
<div class="grey lighten-4">
  <div class="section">
    <div class="container">

      <div class="col s12 center">
        <h3>ROLE-BASED IDENTIFICATION, DATA INTEGRITY AND AUTONOMOUS POLICY COMPLIANCE</h3>
        <p>The Lequinox trust service platform empowers the digitally transformed organisation to manage the security issues
          related to role-based identification, policy compliance, security and data integrity. With a pay-as-you-go model,
          the Lequinox platform reduces cyber-resilience costs and enables digital communication and processes with verifiable
          identities, advanced electronic signatures and an irrefutable audit trail for all interaction parties.</p>
        <br>

      </div>

      <!--   Icon Section   -->
      <div class="row">
        <div class="col s12 m4 l4">
          <div class="icon-block">
            <h2 class="center">
              <img src="${icon1}">
            </h2>
            <h5 class="center">ROLE-BASED IDENTIFICATION</h5>

          </div>
        </div>

        <div class="col s12 m4 l4">
          <div class="icon-block">
            <h2 class="center">
              <img src="${icon2}">
            </h2>
            <h5 class="center">TRACEABILITY & ARCHIVING</h5>

          </div>
        </div>

        <div class="col s12 m4 l4">
          <div class="icon-block">
            <h2 class="center">
              <img src="${icon3}">
            </h2>
            <h5 class="center">SYSTEM INTEROPERABILITY</h5>

          </div>
        </div>
      </div>

      <div class="row col s12 center">
        <br>
        <br>
        <!-- Link to P2 (Platform) -->
        <a class="btn p2Link">Learn More</a>
      </div>

    </div>
  </div>
</div>

<div class="section">
  <div class="container">
    <div class="row">
      <div class="col l4 m6 s8 offset-s2 offset-m3 pull-l1 offset-l3">

        <h3>LEQUINOX SOLUTIONS</h3>
        <p>Lequinox platform solutions empower enterprises across various sectors to focus on the added value of new cloud based
          technologies, while automating policy compliance and data security.</p>
        <br>
        <!-- Link to P7 (Platform Solutions) -->
        <a class="p7Link btn ">Learn More</a>
        <br>
        <br>
        <br>
        <br>
      </div>
      <div class=" center">

        <img src="${diagram}" style="opacity: 0.8;" class="col m6 s8 offset-s2 offset-m3 l4">
        <br>

      </div>
    </div>

  </div>
</div>

<div class="row" style="background-color: #19A882;">

  <div class="parallax-container col s12 m12 l6" style="z-index: 20">
    <div class="section">
      <div class="container">
        <div class="center white-text">
          <h3 class="col s12">LEQUINOX FRAMEWORK APPLICATIONS</h3>
          <p>Designed for everyday business needs, Lequinox framework applications provide trust services for e-mail communication,
            document review and signing processes. They enable authentication of participants, advanced electronic signatures,
            data and process integrity in most electronic documents and forms requiring legal and compliance assurance.
          </p>
          <br>

          <div class="row">
            <div class="col s12 center">
              <!-- Link to P4 (Application) -->
              <a class="p4Link btn white lightBtn">Learn More</a>
            </div>

          </div>

        </div>
      </div>
    </div>

    <div class="parallax" style="background-color: rgb(20, 20, 20)">
      <img src="${apps}" alt="Framework Apps" style="opacity: 0.9;">
    </div>

  </div>
  <div class="col s12 m12 l6">
    <div class="section">
      <div class="container">
        <div class="center white-text">
          <img src="${cloud28White}" alt="" srcset="" class="responsive-img" style="width: 30%;">
          <h3 class="col s12">Connect to Cloud28+</h3>
          <p>Connect to Cloud28+ and find applications and services connected to Lequinox trust service platform.
          </p>
          <br>
          <div class="row">
            <div class="col s12 center">
              <a href="https://www.cloud28plus.com" target="_blank" rel="noopener" class="btn white lightBtn">Learn More</a>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
`;
}
