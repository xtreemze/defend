const lequinoxLogo = require(/* webpackPreload: true */ "./../../img/Lequinox_logo.svg");

export default function menuContentGenerator(content) {
  return /* html */ `<!-- Dropdown Structure -->
<div class="navbar-fixed">
  <nav role="navigation">
    <div class="nav-wrapper">
      <form class="right hide-on-med-and-down hide">
        <div class="input-field">
          <input id="search" type="search" required="" class="white-text">
          <label class="label-icon" for="search">
            <i class="material-icons">search</i>
          </label>
          <span style="font-size: 2rem;">&Cross;</span>
        </div>
      </form>
      <div class="container">
        <a id="logo-container" class="p1Link brand-logo logo">
          <img src="${lequinoxLogo}" alt="" class="responsive-img">
        </a>

        <ul class="right hide-on-med-and-down">

          <!-- Dropdown Trigger -->
          <li>
            <a class="dropdown-trigger p2Link" data-target="p2Dropdown">Platform Overview
              <span class="right dropdownArrow">&dtrif;</span>
            </a>
            <ul id="p2Dropdown" class="dropdown-content">
              <li>
                <a class="p3Link">Platform Description</a>
              </li>
            </ul>
          </li>
          <!-- Dropdown Trigger -->
          <li>
            <a class="dropdown-trigger p4Link" data-target="p3Dropdown">Applications Overview
              <span class="right dropdownArrow">&dtrif;</span>
            </a>
            <ul id="p3Dropdown" class="dropdown-content">
              <li>
                <a class="p5Link">Framework Apps</a>
              </li>
              <li>
                <a class="p6Link">Partner Applications</a>
              </li>
            </ul>
          </li>
          <!-- Dropdown Trigger -->
          <li>
            <a class="dropdown-trigger p7Link" data-target="p4Dropdown">Solution Overview
              <span class="right dropdownArrow">&dtrif;</span>
            </a>
            <ul id="p4Dropdown" class="dropdown-content">
              <li>
                <a class="p8Link">Empower Business</a>
              </li>
              <li>
                <a class="p9Link">Empower Tech</a>
              </li>
              <li>
                <a class="p10Link">Empower Compliance</a>
              </li>
            </ul>
          </li>

          <li class="hide">
            <a class="hide portalLink btn z-depth-1 roundBtn whiteBtn waves-effect waves-light" style="padding: 0 !important; font-variant: normal; font-size: 2rem">Customer Portal
            </a>
          </li>
        </ul>
      </div>
      <a href="#" data-target="nav-mobile" class="sidenav-trigger">
        <span style="font-size: 2rem;">&#x2630;</span>
      </a>

    </div>
  </nav>

</div>
<ul id="nav-mobile" class="sidenav collapsible">

  <a class="p1Link">
    <li>
      <img src="${lequinoxLogo}" alt="" class="responsive-img pointer" style="margin-left: 1.5rem;">
    </li>
  </a>
  <!--  <li class="nav-wrapper">
    <form style="margin: 0" lpformnum="1">
      <div class="input-field">
        <input id="search" type="search" required="" class="white-text" style="width: 14rem">
        <label class="label-icon" for="search">
          <i class="material-icons" style="line-height: 1.5;">search</i>
        </label>
        <i class="material-icons" style="line-height: 1.5;">close</i>
      </div>
    </form>
  </li> -->

  <!-- Dropdown Trigger -->
  <li>
    <a class="p2Link collapsible-header">
      Platform Overview
    </a>

    <ul class="collapsible-body">
      <li>
        <a class="p3Link pointer">Platform Description</a>
      </li>
    </ul>
  </li>
  <!-- Dropdown Trigger -->
  <li>
    <a class="p4Link collapsible-header">Applications Overview
    </a>
    <ul class="collapsible-body">
      <li>
        <a class="p5Link pointer">Framework Apps</a>
      </li>
      <li>
        <a class="p6Link pointer">Partner Applications</a>
      </li>
    </ul>
  </li>
  <!-- Dropdown Trigger -->
  <li>
    <a class="p7Link collapsible-header">Solution Overview
    </a>
    <ul class="collapsible-body">
      <li>
        <a class="p8Link pointer">Empower Business</a>
      </li>
      <li>
        <a class="p9Link pointer">Empower Tech</a>
      </li>
      <li>
        <a class="p10Link pointer">Empower Compliance</a>
      </li>
    </ul>
  </li>

  <li class="hide">
    <a class="hide portalLink btn z-depth-1 roundBtn whiteBtn waves-effect waves-light" style="padding: 0 !important; font-variant: normal; font-size: 1rem">Customer Portal
    </a>
  </li>

</ul>
`;
}
