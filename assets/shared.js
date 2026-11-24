(() => {
  const links = [
    ["Home", "index.html", "home"],
    ["Weekend Planner", "weekend-planner.html", "planner"],
    ["Explore Cities", "explore-cities.html", "cities"],
    ["How It Works", "how-it-works.html", "how"],
    ["About Offscript", "about.html", "about"],
  ];
  const current = document.body.dataset.page || "home";
  const nav = links.map(([label, href, id]) => `<a href="${href}" ${current === id ? 'aria-current="page"' : ""}>${label}</a>`).join("");
  const header = document.querySelector("[data-site-header]");
  if (header) header.innerHTML = `<div class="wrap nav-shell"><a class="brand" href="index.html" aria-label="Offscript home"><img src="assets/offscript-logo.svg" alt="Offscript — Weekend plans, your way"></a><button class="menu-toggle" type="button" aria-expanded="false" aria-label="Open menu">☰</button><nav class="nav-links" aria-label="Main navigation">${nav}</nav><a class="nav-cta" href="weekend-planner.html">Plan my weekend ↗</a></div>`;
  const footer = document.querySelector("[data-site-footer]");
  if (footer) footer.innerHTML = `<div class="wrap"><div class="footer-grid"><div class="footer-brand"><a href="index.html"><img src="assets/offscript-logo.svg" alt="Offscript"></a><p>Find a little more to love about your weekend. Start with Bhopal, then explore ideas for other Indian cities.</p></div><div class="footer-col"><h3>Explore</h3><a href="weekend-planner.html">Weekend Planner</a><a href="explore-cities.html">Explore Cities</a><a href="how-it-works.html">How It Works</a></div><div class="footer-col"><h3>About</h3><a href="about.html">About Offscript</a><a href="weekend-planner.html">Bhopal places</a><a href="https://bhopal.nic.in/en/tourism/" target="_blank" rel="noopener">Bhopal tourism source ↗</a></div></div><div class="fine-print"><span>© <span data-year></span> Offscript. Weekend plans, your way.</span><span>Place details can change. Check the linked source and map before visiting.</span></div></div>`;
  document.querySelectorAll("[data-year]").forEach((node) => node.textContent = new Date().getFullYear());
  document.querySelector(".menu-toggle")?.addEventListener("click", (event) => {
    const button = event.currentTarget;
    const menu = document.querySelector(".nav-links");
    const open = menu.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
    button.textContent = open ? "×" : "☰";
  });
})();
