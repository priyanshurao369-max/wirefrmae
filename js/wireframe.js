(function () {
  var FEST = new Date("2026-11-19T09:00:00");

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function injectChrome() {
    if (!document.body || document.body.dataset.chrome === "off") return;
    var page = document.body.dataset.page || "";
    var header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML =
      '<a class="mark" href="home.html">ARMSCON</a>' +
      '<div class="header-right">' +
      '<div class="countdown" data-countdown>19 NOV 2026</div>' +
      '<button class="menu-btn" type="button" data-menu-open>Menu</button>' +
      "</div>";

    var nav = document.createElement("nav");
    nav.className = "menu-overlay";
    nav.setAttribute("data-menu", "");
    nav.innerHTML =
      '<button class="menu-close" type="button" data-menu-close>Close</button>' +
      '<ol class="menu-list">' +
      menuLink("home.html", "Home", page === "home") +
      menuLink("brochure.pdf", "Brochure", false) +
      menuLink("workshops.html", "Workshops", page === "workshops") +
      menuLink("events.html", "Events", page === "events") +
      menuLink("cultural.html", "Cultural", page === "cultural") +
      menuLink("profile.html", "Registration", page === "profile" || page === "register") +
      menuLink("sponsors.html", "Sponsors", page === "sponsors") +
      menuLink("teams.html", "Teams", page === "teams") +
      menuLink("about.html", "About", page === "about") +
      "</ol>";

    document.body.insertBefore(nav, document.body.firstChild);
    document.body.insertBefore(header, document.body.firstChild);
  }

  function menuLink(href, label, active) {
    var extra = "";
    if (href.indexOf(".pdf") !== -1) extra = ' target="_blank" rel="noopener"';
    return (
      "<li><a href=\"" +
      href +
      "\"" +
      extra +
      (active ? ' class="is-active"' : "") +
      ">" +
      label +
      "</a></li>"
    );
  }

  function initMenu() {
    var overlay = $("[data-menu]");
    if (!overlay) return;
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-menu-open]")) {
        overlay.classList.add("is-open");
      }
      if (e.target.closest("[data-menu-close]") || (e.target === overlay)) {
        overlay.classList.remove("is-open");
      }
    });
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function initCountdown() {
    var el = $("[data-countdown]");
    if (!el) return;
    function tick() {
      var now = new Date();
      var diff = FEST - now;
      if (diff <= 0) {
        el.textContent = "LIVE · 19–21 NOV";
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      el.textContent = d + "d " + pad(h) + "h " + pad(m) + "m · 19 NOV";
    }
    tick();
    setInterval(tick, 30000);
  }

  function initLanding() {
    var fill = $("[data-loader-fill]");
    var enter = $("[data-enter]");
    var status = $("[data-loader-status]");
    if (!fill || !enter) return;
    var start = Date.now();
    var duration = 2200;
    function frame() {
      var p = Math.min(1, (Date.now() - start) / duration);
      fill.style.width = p * 100 + "%";
      if (p < 1) {
        requestAnimationFrame(frame);
      } else {
        enter.classList.add("is-ready");
        if (status) status.textContent = "Ready";
      }
    }
    requestAnimationFrame(frame);
  }

  function initSlider() {
    var track = $("[data-slider-track]");
    if (!track) return;
    var posters = $all(".poster", track);
    posters.forEach(function (node) {
      track.appendChild(node.cloneNode(true));
    });
    var x = 0;
    var paused = false;
    setInterval(function () {
      if (paused) return;
      x -= 1;
      if (Math.abs(x) > track.scrollWidth / 2) x = 0;
      track.style.transform = "translateX(" + x + "px)";
    }, 20);
    var slider = track.parentElement;
    slider.addEventListener("mouseenter", function () {
      paused = true;
    });
    slider.addEventListener("mouseleave", function () {
      paused = false;
    });
  }

  function initSheet() {
    var sheet = $("[data-sheet]");
    if (!sheet) return;
    var title = $("[data-sheet-title]", sheet);
    var body = $("[data-sheet-body]", sheet);
    document.addEventListener("click", function (e) {
      var poster = e.target.closest(".poster");
      if (poster) {
        title.textContent = poster.dataset.title || poster.textContent.trim();
        body.textContent = poster.dataset.body || "";
        sheet.classList.add("is-open");
      }
      if (e.target.closest("[data-sheet-close]")) {
        sheet.classList.remove("is-open");
      }
    });
  }

  function initChoices() {
    $all("[data-choice-group]").forEach(function (group) {
      group.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-choice]");
        if (!btn) return;
        $all("[data-choice]", group).forEach(function (b) {
          b.classList.remove("is-on");
        });
        btn.classList.add("is-on");
        var target = btn.dataset.show;
        $all("[data-pane]", group.parentElement).forEach(function (pane) {
          pane.hidden = pane.dataset.pane !== target;
        });
        try {
          sessionStorage.setItem(group.dataset.choiceGroup, btn.dataset.choice);
        } catch (err) {}
      });
    });
  }

  function initPicks() {
    document.addEventListener("click", function (e) {
      var pick = e.target.closest("[data-pick]");
      if (!pick) return;
      pick.classList.toggle("is-on");
    });
  }

  function savePicks() {
    var form = $("[data-picks-form]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var selected = $all(".pick.is-on").map(function (p) {
        return p.dataset.pick;
      });
      try {
        sessionStorage.setItem("armscon-picks", JSON.stringify(selected));
      } catch (err) {}
      window.location.href = form.getAttribute("action") || "register-extras.html";
    });
  }

  function saveExtras() {
    var form = $("[data-extras-form]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      try {
        sessionStorage.setItem(
          "armscon-star",
          ($("[name=star]:checked") || {}).value || "no"
        );
        sessionStorage.setItem(
          "armscon-contest",
          ($("[name=contest]:checked") || {}).value || "skip"
        );
      } catch (err) {}
      window.location.href = "payment.html";
    });
  }

  function saveRegister() {
    var form = $("[data-register-form]");
    if (!form) return;
    try {
      if (!sessionStorage.getItem("college-path")) {
        sessionStorage.setItem("college-path", "pgims");
      }
    } catch (err) {}
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        name: (form.elements.name && form.elements.name.value) || "Student",
        email: (form.elements.email && form.elements.email.value) || "",
        phone: (form.elements.phone && form.elements.phone.value) || "",
        path: sessionStorage.getItem("college-path") || "pgims",
      };
      try {
        sessionStorage.setItem("armscon-user", JSON.stringify(data));
      } catch (err) {}
      window.location.href = "register-picks.html";
    });
  }

  function fillPayment() {
    var box = $("[data-pay-summary]");
    if (!box) return;
    var user = {};
    var picks = [];
    try {
      user = JSON.parse(sessionStorage.getItem("armscon-user") || "{}");
      picks = JSON.parse(sessionStorage.getItem("armscon-picks") || "[]");
    } catch (err) {}
    var star = sessionStorage.getItem("armscon-star") || "yes";
    var contest = sessionStorage.getItem("armscon-contest") || "skip";
    box.innerHTML =
      "<p><strong>" +
      (user.name || "Student") +
      "</strong><br>" +
      (user.email || "email on file") +
      "</p>" +
      "<p>Picks: " +
      (picks.length ? picks.join(", ") : "none selected") +
      "</p>" +
      "<p>Star night: " +
      star +
      "<br>Mr &amp; Miss ARMSCON: " +
      contest +
      "</p>" +
      "<p>Amount (dummy): INR 1,499</p>";
  }

  function initTickets() {
    var btn = $("[data-open-tickets]");
    var panel = $("[data-ticket-panel]");
    if (!btn || !panel) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      panel.classList.toggle("is-open");
    });
    if (window.location.hash === "#tickets") panel.classList.add("is-open");
  }

  function fillProfile() {
    var slot = $("[data-profile-info]");
    if (!slot) return;
    var user = {};
    var picks = [];
    try {
      user = JSON.parse(sessionStorage.getItem("armscon-user") || "{}");
      picks = JSON.parse(sessionStorage.getItem("armscon-picks") || "[]");
    } catch (err) {}
    if (!user.name) user.name = "Demo student";
    slot.innerHTML =
      "<p><strong>" +
      user.name +
      "</strong></p>" +
      "<p>" +
      (user.email || "student@example.com") +
      "<br>" +
      (user.phone || "98765 00000") +
      "</p>" +
      "<p>Path: " +
      (user.path === "other" ? "Other college" : "PGIMS") +
      "</p>" +
      "<p>Selected: " +
      (picks.length ? picks.join(", ") : "Workshops / events after payment") +
      "</p>";
  }

  function initFlips() {
    document.addEventListener("click", function (e) {
      var card = e.target.closest("[data-flip]");
      if (!card) return;
      card.classList.toggle("is-flipped");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectChrome();
    initMenu();
    initCountdown();
    initLanding();
    initSlider();
    initSheet();
    initChoices();
    initPicks();
    savePicks();
    saveExtras();
    saveRegister();
    fillPayment();
    initTickets();
    fillProfile();
    initFlips();
  });
})();
