(() => {
  const groups = window.INDIA_CITY_GROUPS || [];
  const list = document.querySelector("#city-directory");
  const input = document.querySelector("#explore-city");
  const form = document.querySelector("#explore-city-form");
  const datalist = document.querySelector("#explore-cities");
  const count = document.querySelector("#city-directory-count");
  const slug = (text) => encodeURIComponent(text);
  const total = groups.reduce((sum, group) => sum + group.cities.length, 0);
  count.textContent = `${total} suggestions · ${groups.length} states & UTs`;
  const cities = [...new Set(groups.flatMap((group) => group.cities))];
  cities.forEach((city) => datalist.append(new Option(city)));
  list.innerHTML = groups.map((group) => `<details class="state-group"><summary>${group.state}<span>${group.cities.length} suggestions</span></summary><div class="state-city-list">${group.cities.map((city) => `<a class="state-city-link" href="weekend-planner.html?city=${slug(city)}" data-city-name="${city.toLowerCase()}">${city}<span>↗</span></a>`).join("")}</div></details>`).join("");
  const applySearch = () => {
    const query = input.value.trim().toLowerCase();
    list.querySelectorAll(".state-group").forEach((groupNode, index) => {
      const groupData = groups[index];
      const matchesState = groupData.state.toLowerCase().includes(query);
      let visibleCities = 0;
      groupNode.querySelectorAll(".state-city-link").forEach((link) => {
        const show = !query || matchesState || link.dataset.cityName.includes(query);
        link.hidden = !show;
        if (show) visibleCities += 1;
      });
      groupNode.hidden = Boolean(query) && visibleCities === 0;
      if (query && !groupNode.hidden) groupNode.open = true;
      if (!query) groupNode.open = false;
    });
  };
  input.addEventListener("input", applySearch);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = input.value.trim() || "Bhopal";
    location.href = `weekend-planner.html?city=${slug(city)}`;
  });
  applySearch();
})();
