(() => {
  const allPlaces = window.OFFSCRIPT_PLACES || [];
  const form = document.querySelector("#planner-filters");
  const cityInput = document.querySelector("#city");
  const cardsNode = document.querySelector("#place-results");
  const countNode = document.querySelector("#result-count");
  const heading = document.querySelector("#results-title");
  const empty = document.querySelector("#empty-state");
  const mapFallback = document.querySelector("#city-map-link");
  const mapCategories = document.querySelector("#city-map-categories");
  const categoryButtons = [...document.querySelectorAll("[data-category]")];
  let category = new URLSearchParams(location.search).get("category") || "all";
  const mapSearches = [
    {key:"nature",icon:"🌿",title:"Nature & walks",query:"parks, lakes, gardens and walking trails"},
    {key:"sports",icon:"⚽",title:"Sports & play",query:"sports grounds, sports arenas and turfs"},
    {key:"cafe",icon:"☕",title:"Cafés & food",query:"cafes and coffee shops"},
    {key:"sunset",icon:"🌇",title:"Sunset spots",query:"sunset viewpoints and lakeside spots"},
    {key:"heritage",icon:"🏛️",title:"Heritage",query:"heritage sites, monuments and museums"},
  ];
  const cityList = [...new Set((window.INDIA_CITY_GROUPS || []).flatMap((group) => group.cities))];
  const cityOptions = document.querySelector("#city-options");
  cityList.forEach((city) => {
    if (![...cityOptions.options].some((option) => option.value.toLowerCase() === city.toLowerCase())) {
      cityOptions.append(new Option(city));
    }
  });
  const cap = (text) => text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
  const mapsUrl = (place, city, preferences = {}) => {
    if (place) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${place.area}, Bhopal`)}`;
    const terms = [preferences.categoryQuery ? `${preferences.categoryQuery} in ${city}, India` : `places to visit in ${city}, India`];
    if (preferences.budget === "low") terms.push("budget friendly");
    if (preferences.budget === "mid") terms.push("mid-range");
    if (preferences.duration === "short") terms.push("short outing");
    if (preferences.duration === "half") terms.push("half-day outing");
    if (preferences.duration === "full") terms.push("day outing");
    if (preferences.companion === "family") terms.push("family-friendly");
    if (preferences.companion === "friends") terms.push("with friends");
    if (preferences.companion === "partner") terms.push("couple-friendly");
    if (preferences.vibe !== "all") terms.push(preferences.vibe);
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(terms.join(" "))}`;
  };
  const categoryMapsUrl = (item, city, preferences) => mapsUrl(null, city, {...preferences, vibe:preferences.vibe === "all" ? item.key : preferences.vibe, categoryQuery:item.query});
  const durationLabel = (minutes) => minutes < 90 ? "About 1 hour" : minutes < 180 ? "About 2–3 hours" : "Half-day idea";
  const priceLabel = (place) => {
    if (place.priceBand === "low") return "Indicative: budget-friendly · confirm current prices";
    if (place.priceBand === "mid") return "Indicative: mid-range · confirm current prices";
    return "Price / entry fee: check before visiting";
  };
  const card = (place) => `<article class="place-card"><div class="place-top"><span class="place-icon" aria-hidden="true">${place.icon}</span><span class="category-badge">${cap(place.category)}</span></div><p class="place-area">⌖ ${place.area}</p><h3>${place.name}</h3><p class="place-description">${place.description}</p><div class="place-meta"><span>◷ ${durationLabel(place.duration)} <small>(suggested)</small></span>${place.dayTrip ? '<span class="daytrip-label">Nearby day trip</span>' : ""}</div><div class="price-note">${priceLabel(place)}</div><div class="place-bottom"><a class="maps-link" href="${mapsUrl(place)}" target="_blank" rel="noopener">Open in Google Maps ↗</a></div><a class="source-link" href="${place.source}" target="_blank" rel="noopener">Source: ${place.sourceLabel} ↗</a></article>`;
  function render() {
    const city = cityInput.value.trim();
    const isBhopal = /^bhopal$/i.test(city);
    const values = new FormData(form);
    const budget = values.get("budget");
    const duration = values.get("duration");
    const companion = values.get("companion");
    const vibe = values.get("vibe");
    let places = isBhopal ? allPlaces.filter((place) => {
      if (category !== "all" && place.category !== category && !place.tags.includes(category)) return false;
      if (budget === "low" && place.priceBand !== "low") return false;
      if (budget === "mid" && place.priceBand !== "mid") return false;
      if (budget === "unknown" && place.priceBand !== "unknown") return false;
      if (duration === "short" && place.duration > 90) return false;
      if (duration === "half" && (place.duration <= 90 || place.duration > 180)) return false;
      if (duration === "full" && place.duration <= 180) return false;
      if (companion !== "any" && !place.companions.includes(companion)) return false;
      if (vibe !== "all" && !place.tags.includes(vibe)) return false;
      return true;
    }) : [];
    heading.textContent = isBhopal ? "Bhopal weekend ideas" : city ? `Discover places in ${city}` : "Weekend ideas";
    countNode.textContent = isBhopal ? `${places.length} sourced place${places.length === 1 ? "" : "s"}` : city ? "Live Google Maps searches" : "Type any Indian city";
    cardsNode.innerHTML = places.map(card).join("");
    empty.hidden = places.length > 0;
    const mapPreferences = {budget,duration,companion,vibe};
    mapFallback.href = mapsUrl(null, city || "Bhopal", mapPreferences);
    const isOtherCity = city.length > 0 && !isBhopal;
    const noCity = city.length === 0;
    document.querySelector("#empty-title").textContent = isOtherCity ? `Explore ${city} by category` : noCity ? "Search any Indian city" : "No Bhopal places match these filters";
    document.querySelector("#empty-copy").textContent = isOtherCity ? `Bhopal is the first Offscript-curated city. These Google Maps searches help you find current places in ${city}; their details are supplied by Maps, not verified by Offscript.` : noCity ? "Type a city name above, or choose one of the popular city buttons." : "Try another category or reset filters to browse the Bhopal directory.";
    mapFallback.hidden = !isOtherCity;
    mapFallback.textContent = `Search all places in ${city} on Maps ↗`;
    mapCategories.hidden = !isOtherCity;
    const selectedMapSearches = category === "all" ? mapSearches : mapSearches.filter((item) => item.key === category);
    mapCategories.innerHTML = selectedMapSearches.map((item) => `<a class="map-search-card" href="${categoryMapsUrl(item, city, mapPreferences)}" target="_blank" rel="noopener"><span>${item.icon}</span><b>${item.title}</b><small>Find current places on Google Maps ↗</small></a>`).join("");
    document.querySelector("#empty-reset").hidden = isOtherCity || noCity;
  }
  form.addEventListener("input", render);
  form.addEventListener("change", render);
  cityInput.addEventListener("input", render);
  if (!categoryButtons.some((button) => button.dataset.category === category)) category = "all";
  categoryButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.category === category));
    button.classList.toggle("active", button.dataset.category === category);
  });
  categoryButtons.forEach((button) => button.addEventListener("click", () => {
    category = button.dataset.category;
    categoryButtons.forEach((item) => { item.setAttribute("aria-pressed", String(item === button)); item.classList.toggle("active", item === button); });
    render();
  }));
  document.querySelectorAll("[data-city]").forEach((button) => button.addEventListener("click", () => { cityInput.value = button.dataset.city; render(); }));
  document.querySelector("#empty-reset").addEventListener("click", () => { form.reset(); cityInput.value = "Bhopal"; category = "all"; categoryButtons.forEach((item) => { item.setAttribute("aria-pressed", String(item.dataset.category === "all")); item.classList.toggle("active", item.dataset.category === "all"); }); render(); });
  document.querySelector("#clear-filters").addEventListener("click", () => { form.reset(); cityInput.value = "Bhopal"; category = "all"; categoryButtons.forEach((item) => { item.setAttribute("aria-pressed", String(item.dataset.category === "all")); item.classList.toggle("active", item.dataset.category === "all"); }); render(); });
  render();
})();
