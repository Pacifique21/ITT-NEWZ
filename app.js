
/* =====================================================
   ITT NEWS - COMPLETE WEBSITE APPLICATION
   Version 2.0
   Works with the existing index.html and config.js
===================================================== */

"use strict";

const cfg = window.ITT_CONFIG || {};

const $ = (selector) => document.querySelector(selector);

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

function safeUrl(value) {
  try {
    const url = new URL(value, window.location.href);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.href;
    }
  } catch (error) {}
  return "";
}

function makeElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

/* =====================================================
   1. NEWS
===================================================== */

let currentNewsCategory = "all";
let currentNewsSearch = "";

function getNews() {
  return Array.isArray(cfg.news) ? cfg.news : [];
}

function renderNews() {
  const grid = $("#newsGrid");
  if (!grid) return;

  const news = getNews().filter(item => {
    const category = String(item.category || "").toLowerCase();

    const matchesCategory =
      currentNewsCategory === "all" ||
      category === currentNewsCategory.toLowerCase();

    const searchText = [
      item.title,
      item.summary,
      item.source,
      item.category
    ].join(" ").toLowerCase();

    const matchesSearch = searchText.includes(currentNewsSearch);

    return matchesCategory && matchesSearch;
  });

  grid.replaceChildren();

  if (!news.length) {
    grid.appendChild(
      makeElement("p", "note", "Nta nkuru ihari. Ongera ugerageze nyuma.")
    );
    return;
  }

  news.forEach(item => {
    const card = makeElement("article", "card");

    card.appendChild(
      makeElement("span", "tag", item.category || "NEWS")
    );

    if (item.imageUrl && safeUrl(item.imageUrl)) {
      const image = document.createElement("img");
      image.src = safeUrl(item.imageUrl);
      image.alt = item.title || "News image";
      image.loading = "lazy";
      image.style.width = "100%";
      image.style.borderRadius = "10px";
      card.appendChild(image);
    }

    card.appendChild(
      makeElement("h3", "", item.title || "Untitled news")
    );

    card.appendChild(
      makeElement("p", "", item.summary || "")
    );

    card.appendChild(
      makeElement("small", "tag", item.source || "ITT NEWS")
    );

    if (item.date) {
      card.appendChild(
        makeElement("p", "note", item.date)
      );
    }

    if (item.videoUrl && safeUrl(item.videoUrl)) {
      const video = document.createElement("video");
      video.controls = true;
      video.preload = "none";
      video.src = safeUrl(item.videoUrl);
      video.style.width = "100%";
      card.appendChild(video);
    }

    const link = safeUrl(item.url);

    if (link) {
      const a = document.createElement("a");
      a.href = link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "Soma inkuru yose";
      card.appendChild(a);
    }

    grid.appendChild(card);
  });
}

function setupNews() {
  const filters = document.querySelectorAll(".filter");

  filters.forEach(button => {
    button.addEventListener("click", () => {
      filters.forEach(item => item.classList.remove("active"));
      button.classList.add("active");

      currentNewsCategory = button.dataset.category || "all";
      renderNews();
    });
  });

  const refresh = $("#refreshNews");

  if (refresh) {
    refresh.addEventListener("click", () => {
      renderNews();
      refresh.textContent = "Byashyizweho!";
      setTimeout(() => {
        refresh.textContent = "Ongera ushyashye";
      }, 1500);
    });
  }

  const section = $("#news");

  if (section) {
    const search = makeElement("input");
    search.type = "search";
    search.placeholder = "Shakisha inkuru...";
    search.setAttribute("aria-label", "Search news");
    search.style.width = "100%";
    search.style.maxWidth = "420px";
    search.style.padding = "12px";
    search.style.margin = "12px 0";
    search.style.border = "1px solid #d6dce5";
    search.style.borderRadius = "8px";

    const grid = $("#newsGrid");
    if (grid) section.insertBefore(search, grid);

    search.addEventListener("input", () => {
      currentNewsSearch = search.value.toLowerCase().trim();
      renderNews();
    });
  }

  renderNews();
}

/* =====================================================
   2. SPORTS
===================================================== */

function renderSports() {
  const area = $("#sportsText");
  if (!area) return;

  const sports = Array.isArray(cfg.sports) ? cfg.sports : [];

  if (!sports.length) {
    area.textContent =
      "Amakuru ya siporo azagaragara hano igihe amakuru mashya cyangwa API yemewe bizaba byashyizwe muri config.js.";
    return;
  }

  area.replaceChildren();

  sports.forEach(match => {
    const card = makeElement("div", "card");

    card.appendChild(
      makeElement("h3", "", match.title || "Sports update")
    );

    card.appendChild(
      makeElement("p", "", match.description || "")
    );

    if (match.score) {
      card.appendChild(
        makeElement("strong", "", "Score: " + match.score)
      );
    }

    if (match.date) {
      card.appendChild(
        makeElement("p", "note", match.date)
      );
    }

    const url = safeUrl(match.url);

    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Reba ibisobanuro";
      card.appendChild(link);
    }

    area.appendChild(card);
  });
}

/* =====================================================
   3. RADIO STATIONS
===================================================== */

const internationalRadios = [
  {
    name: "Radio Rwanda",
    country: "Rwanda",
    region: "Rwanda",
    language: "Kinyarwanda",
    url: "https://www.rba.co.rw/radio/"
  },
  {
    name: "Magic FM",
    country: "Rwanda",
    region: "Rwanda",
    language: "Kinyarwanda",
    url: "https://www.rba.co.rw/radio/"
  },
  {
    name: "Radio Rubavu",
    country: "Rwanda",
    region: "Rwanda",
    language: "Kinyarwanda",
    url: "https://www.rba.co.rw/radio/"
  },
  {
    name: "Radio Huye",
    country: "Rwanda",
    region: "Rwanda",
    language: "Kinyarwanda",
    url: "https://www.rba.co.rw/radio/"
  },
  {
    name: "Radio Musanze",
    country: "Rwanda",
    region: "Rwanda",
    language: "Kinyarwanda",
    url: "https://www.rba.co.rw/radio/"
  },
  {
    name: "Radio 10",
    country: "Rwanda",
    region: "Rwanda",
    language: "Kinyarwanda / English",
    url: "https://radiotv10.rw/"
  },
  {
    name: "Kiss 100",
    country: "Kenya",
    region: "Africa",
    language: "English",
    url: "https://radioafricagroup.co.ke/"
  },
  {
    name: "Classic 105",
    country: "Kenya",
    region: "Africa",
    language: "English",
    url: "https://radioafricagroup.co.ke/"
  },
  {
    name: "Radio Jambo",
    country: "Kenya",
    region: "Africa",
    language: "Swahili",
    url: "https://radioafricagroup.co.ke/"
  },
  {
    name: "Homeboyz Radio",
    country: "Kenya",
    region: "Africa",
    language: "English",
    url: "https://radioafricagroup.co.ke/"
  },
  {
    name: "BBC World Service",
    country: "United Kingdom",
    region: "International",
    language: "English",
    url: "https://www.bbc.com/audio"
  },
  {
    name: "BBC Radio 1",
    country: "United Kingdom",
    region: "International",
    language: "English",
    url: "https://www.bbc.com/audio"
  },
  {
    name: "BBC Radio 4",
    country: "United Kingdom",
    region: "International",
    language: "English",
    url: "https://www.bbc.com/audio"
  },
  {
    name: "NPR",
    country: "United States",
    region: "International",
    language: "English",
    url: "https://www.npr.org/"
  },
  {
    name: "Radio France",
    country: "France",
    region: "International",
    language: "French",
    url: "https://www.radiofrance.fr/"
  },
  {
    name: "Deutsche Welle",
    country: "Germany",
    region: "International",
    language: "German / English",
    url: "https://www.dw.com/"
  }
];

function getRadios() {
  const configured = Array.isArray(cfg.radios) ? cfg.radios : [];

  const combined = [...internationalRadios, ...configured];

  const seen = new Set();

  return combined.filter(radio => {
    const key = String(radio.name || "").toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function setupRadio() {
  const grid = $("#radioGrid");
  if (!grid) return;

  const section = $("#radio");

  const controls = makeElement("div", "filters");

  const search = document.createElement("input");
  search.type = "search";
  search.placeholder = "Shaka radio cyangwa igihugu...";
  search.style.padding = "12px";
  search.style.minWidth = "220px";
  search.style.borderRadius = "8px";
  search.style.border = "1px solid #d6dce5";

  const region = document.createElement("select");
  region.innerHTML = `
    <option value="all">Ibihugu byose</option>
    <option value="Rwanda">Rwanda</option>
    <option value="Africa">Afurika</option>
    <option value="International">Ahandi ku isi</option>
  `;

  controls.append(search, region);
  section.insertBefore(controls, grid);

  const playerPanel = makeElement("div", "panel");
  playerPanel.style.marginTop = "20px";

  const playerTitle = makeElement("h3", "", "ITT NEWS Radio Player");

  const audio = document.createElement("audio");
  audio.controls = true;
  audio.preload = "none";
  audio.style.width = "100%";

  const status = makeElement(
    "p",
    "note",
    "Hitamo radio ifite stream yemewe kugira ngo uyumve hano."
  );

  playerPanel.append(playerTitle, audio, status);
  section.appendChild(playerPanel);

  function render() {
    const query = search.value.toLowerCase().trim();
    const selected = region.value;

    const stations = getRadios().filter(radio => {
      const text = [
        radio.name,
        radio.country,
        radio.language
      ].join(" ").toLowerCase();

      const matchesText = text.includes(query);
      const matchesRegion =
        selected === "all" || radio.region === selected;

      return matchesText && matchesRegion;
    });

    grid.replaceChildren();

    stations.forEach(radio => {
      const card = makeElement("article", "card");

      card.appendChild(
        makeElement("span", "tag", radio.region || "RADIO")
      );

      card.appendChild(
        makeElement("h3", "", radio.name)
      );

      card.appendChild(
        makeElement(
          "p",
          "",
          `${radio.country || ""} • ${radio.language || ""}`
        )
      );

      if (radio.stream && safeUrl(radio.stream)) {
        const play = document.createElement("button");
        play.type = "button";
        play.textContent = "▶ Play here";

        play.addEventListener("click", async () => {
          audio.pause();
          audio.src = safeUrl(radio.stream);
          audio.load();

          playerTitle.textContent = radio.name;
          status.textContent = "Turagerageza gucuranga...";

          try {
            await audio.play();
            status.textContent = "Radio irimo gucuranga.";
          } catch (error) {
            status.textContent =
              "Stream ntishoboye gucuranga. Gerageza urubuga rwemewe.";
          }
        });

        card.appendChild(play);
      } else {
        card.appendChild(
          makeElement("p", "note", "Umva kuri website yemewe.")
        );
      }

      const official = safeUrl(radio.url);

      if (official) {
        const link = document.createElement("a");
        link.href = official;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Fungura radio";
        card.appendChild(link);
      }

      grid.appendChild(card);
    });

    if (!stations.length) {
      grid.appendChild(
        makeElement("p", "note", "Nta radio ibonetse.")
      );
    }
  }

  search.addEventListener("input", render);
  region.addEventListener("change", render);

  audio.addEventListener("error", () => {
    status.textContent =
      "Stream yanze gukora. Gerageza urubuga rwemewe rwa radio.";
  });

  render();
}

/* =====================================================
   4. MOVIES AND DOCUMENTARIES
===================================================== */

function renderMovies() {
  const grid = $("#movieGrid");
  if (!grid) return;

  const movies = Array.isArray(cfg.movies) ? cfg.movies : [];

  grid.replaceChildren();

  movies.forEach(movie => {
    const card = makeElement("article", "card");

    card.appendChild(
      makeElement("span", "tag", movie.type || "VIDEO")
    );

    card.appendChild(
      makeElement("h3", "", movie.title || "Untitled video")
    );

    card.appendChild(
      makeElement("p", "", movie.description || "")
    );

    const videoUrl = safeUrl(movie.videoUrl);

    if (videoUrl) {
      const video = document.createElement("video");
      video.controls = true;
      video.preload = "none";
      video.src = videoUrl;
      video.style.width = "100%";
      video.style.borderRadius = "10px";
      card.appendChild(video);
    } else {
      card.appendChild(
        makeElement(
          "p",
          "note",
          "Video ntirashyirwamo. Ongeramo video ufitiye uburenganzira."
        )
      );
    }

    grid.appendChild(card);
  });

  if (!movies.length) {
    grid.appendChild(
      makeElement("p", "note", "Nta filime irashyirwamo.")
    );
  }
}

/* =====================================================
   5. 12 LANGUAGES
===================================================== */

const translations = {
  rw: {
    news: "Amakuru",
    sports: "Siporo",
    radio: "Radiyo",
    movies: "Filime",
    latest: "Amakuru aheruka",
    scores: "Siporo n'ibitego"
  },

  en: {
    news: "News",
    sports: "Sports",
    radio: "Radio",
    movies: "Movies",
    latest: "Latest news",
    scores: "Sports and scores"
  },

  fr: {
    news: "Actualités",
    sports: "Sport",
    radio: "Radio",
    movies: "Films",
    latest: "Dernières nouvelles",
    scores: "Sports et résultats"
  },

  sw: {
    news: "Habari",
    sports: "Michezo",
    radio: "Redio",
    movies: "Filamu",
    latest: "Habari za hivi karibuni",
    scores: "Michezo na matokeo"
  },

  ar: {
    news: "الأخبار",
    sports: "الرياضة",
    radio: "الراديو",
    movies: "الأفلام",
    latest: "آخر الأخبار",
    scores: "الرياضة والنتائج"
  },

  es: {
    news: "Noticias",
    sports: "Deportes",
    radio: "Radio",
    movies: "Películas",
    latest: "Últimas noticias",
    scores: "Deportes y resultados"
  },

  pt: {
    news: "Notícias",
    sports: "Desporto",
    radio: "Rádio",
    movies: "Filmes",
    latest: "Últimas notícias",
    scores: "Desporto e resultados"
  },

  de: {
    news: "Nachrichten",
    sports: "Sport",
    radio: "Radio",
    movies: "Filme",
    latest: "Neueste Nachrichten",
    scores: "Sport und Ergebnisse"
  },

  zh: {
    news: "新闻",
    sports: "体育",
    radio: "广播",
    movies: "电影",
    latest: "最新消息",
    scores: "体育与比分"
  },

  hi: {
    news: "समाचार",
    sports: "खेल",
    radio: "रेडियो",
    movies: "फ़िल्में",
    latest: "ताज़ा खबरें",
    scores: "खेल और स्कोर"
  },

  ja: {
    news: "ニュース",
    sports: "スポーツ",
    radio: "ラジオ",
    movies: "映画",
    latest: "最新ニュース",
    scores: "スポーツと結果"
  },

  ru: {
    news: "Новости",
    sports: "Спорт",
    radio: "Радио",
    movies: "Фильмы",
    latest: "Последние новости",
    scores: "Спорт и результаты"
  }
};

function setupLanguages() {
  const language = $("#language");
  if (!language) return;

  function changeLanguage(code) {
    const dictionary = translations[code] || translations.rw;

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;

      if (dictionary[key]) {
        element.textContent = dictionary[key];
      }
    });

    document.documentElement.lang = code;

    document.documentElement.dir =
      code === "ar" ? "rtl" : "ltr";
  }

  language.addEventListener("change", event => {
    changeLanguage(event.target.value);
  });

  changeLanguage(language.value || "rw");
}

/* =====================================================
   6. PWA SERVICE WORKER
===================================================== */

function registerPWA() {
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("./service-worker.js")
      .catch(error => {
        console.log("Service worker not registered:", error);
      });
  }
}

/* =====================================================
   7. START THE APPLICATION
===================================================== */

function setupNewsVideos() {
  if (document.getElementById("itt-news-videos")) return;

  const section = document.createElement("section");
  section.id = "itt-news-videos";
  section.innerHTML = `
    <h2>📺 LIVE TV & LATEST NEWS VIDEOS</h2>
    <p>Reba amashusho mashya y'amakuru aturutse ku bitangazamakuru bitandukanye.</p>

    <div class="news-video-grid">
      <article class="news-video-card">
        <h3>TV10 Rwanda – Latest Videos</h3>
        <iframe
          src="https://www.youtube.com/embed/videoseries?list=UU4p7042h6Fj_cOnXIzS_sag"
          title="TV10 Rwanda latest videos"
          loading="lazy"
          allowfullscreen>
        </iframe>
      </article>

      <article class="news-video-card">
        <h3>BBC News – Latest Videos</h3>
        <iframe
          src="https://www.youtube.com/embed/videoseries?list=UU16niRr50-MSBwiO3YDb3RA"
          title="BBC News latest videos"
          loading="lazy"
          allowfullscreen>
        </iframe>
      </article>
    </div>

    <h3>📡 Watch Live Television</h3>
    <div class="news-tv-links">
      <a href="https://radiotv10.rw/tvpage/" target="_blank" rel="noopener">
        TV10 Rwanda Live
      </a>
      <a href="https://www.rba.co.rw/" target="_blank" rel="noopener">
        Rwanda Broadcasting Agency
      </a>
      <a href="https://www.bbc.com/news" target="_blank" rel="noopener">
        BBC News
      </a>
    </div>
  `;

  const movies = document.getElementById("movies");
  const movieGrid = document.getElementById("movieGrid");

  if (movies) {
    movies.parentNode.insertBefore(section, movies);
  } else if (movieGrid) {
    movieGrid.parentNode.insertBefore(section, movieGrid);
  } else {
    document.querySelector("main")?.appendChild(section);
  }
}

function stepupnewsVideos() {
  const year = $("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  setupNews();
  renderSports();
  setupRadio();
  stepupMovies();
/* =====================================================
   ITT NEWS MOVIES - MOVIE BROWSER AND VIDEO PLAYER
===================================================== */

let ittMovieList = [];
let ittMovieSearch = "";
let ittMovieCategory = "all";

function setupMovies() {
  const grid = document.querySelector("#movieGrid");
  if (!grid) return;

  const section = document.querySelector("#movies") ||
                  grid.parentElement;

  const controls = document.createElement("div");
  controls.className = "itt-movie-controls";

  controls.innerHTML = `
    <input id="ittMovieSearch"
      type="search"
      placeholder="Shakisha film ukoresheje izina...">

    <select id="ittMovieCategory">
      <option value="all">Filime zose</option>
      <option value="feature">Feature films</option>
      <option value="documentary">Documentaries</option>
      <option value="classic">Classic films</option>
    </select>
  `;

  section.insertBefore(controls, grid);

  const playerPanel = document.createElement("div");
  playerPanel.id = "ittMoviePlayer";
  playerPanel.className = "itt-movie-player panel";

  playerPanel.innerHTML = `
    <h2 id="ittPlayingTitle">Hitamo film ushaka kureba</h2>
    <video id="ittVideo" controls playsinline preload="metadata">
    </video>
    <p id="ittMovieStatus">
      Film wahisemo izakinirwa hano.
    </p>
    <a id="ittMovieSource"
       href="https://archive.org/"
       target="_blank"
       rel="noopener noreferrer">
       Movie source
    </a>
  `;

  section.appendChild(playerPanel);

  const search = document.querySelector("#ittMovieSearch");
  const category = document.querySelector("#ittMovieCategory");

  search.addEventListener("input", () => {
    ittMovieSearch = search.value.toLowerCase().trim();
    displayITMovies();
  });

  category.addEventListener("change", () => {
    ittMovieCategory = category.value;
    displayITMovies();
  });

  // Add movies supplied by config.js, if any.
  const configured = Array.isArray(cfg.movies) ? cfg.movies : [];

  ittMovieList = configured.map(movie => ({
    title: movie.title || "Untitled movie",
    description: movie.description || "",
    category: movie.category || "feature",
    videoUrl: movie.videoUrl || "",
    poster: movie.imageUrl || movie.poster || "",
    source: movie.source || "ITT NEWS",
    license: movie.license || "User-provided licensed video",
    pageUrl: movie.url || ""
  }));

  displayITMovies();
  loadPublicDomainMovies();
}

function displayITMovies() {
  const grid = document.querySelector("#movieGrid");
  if (!grid) return;

  grid.replaceChildren();

  const filtered = ittMovieList.filter(movie => {
    const matchesSearch =
      (movie.title + " " + movie.description)
      .toLowerCase().includes(ittMovieSearch);

    const matchesCategory =
      ittMovieCategory === "all" ||
      movie.category === ittMovieCategory;

    return matchesSearch && matchesCategory;
  });

  if (!filtered.length) {
    grid.appendChild(
      makeElement("p", "note",
        "Nta film yabonetse. Gerageza irindi zina.")
    );
    return;
  }

  filtered.forEach(movie => {
    const card = makeElement("article", "card");

    if (movie.poster && safeUrl(movie.poster)) {
      const poster = document.createElement("img");
      poster.src = safeUrl(movie.poster);
      poster.alt = movie.title;
      poster.loading = "lazy";
      poster.className = "itt-movie-poster";
      card.appendChild(poster);
    }

    card.appendChild(
      makeElement("span", "tag", movie.category)
    );

    card.appendChild(
      makeElement("h3", "", movie.title)
    );

    card.appendChild(
      makeElement("p", "", movie.description)
    );

    card.appendChild(
      makeElement("small", "note", movie.license)
    );

    const play = document.createElement("button");
    play.type = "button";
    play.textContent = "▶ REBA FILM";

    play.addEventListener("click", () => {
      playITMovie(movie);
    });

    card.appendChild(play);
    grid.appendChild(card);
  });
}

function playITMovie(movie) {
  const video = document.querySelector("#ittVideo");
  const title = document.querySelector("#ittPlayingTitle");
  const status = document.querySelector("#ittMovieStatus");
  const source = document.querySelector("#ittMovieSource");

  if (!video || !movie.videoUrl) {
    status.textContent =
      "Iyi film nta video stream iboneka yo kuyicuranga.";
    return;
  }

  const videoUrl = safeUrl(movie.videoUrl);

  if (!videoUrl) {
    status.textContent = "Video URL ntabwo yemewe.";
    return;
  }

  video.pause();
  video.src = videoUrl;
  video.load();

  title.textContent = movie.title;
  status.textContent = "Tegereza gato, film irafunguka...";

  source.href = safeUrl(movie.pageUrl) ||
                "https://archive.org/";

  video.play().then(() => {
    status.textContent = "Film iri gucuranga.";
    document.querySelector("#ittMoviePlayer")
      .scrollIntoView({ behavior: "smooth" });
  }).catch(() => {
    status.textContent =
      "Kanda Play kuri video. Niba yanze, reba source y'umwimerere.";
  });
}

/* =====================================================
   LOAD PUBLIC-DOMAIN FILMS FROM INTERNET ARCHIVE
===================================================== */

async function loadPublicDomainMovies() {
  const status = document.querySelector("#ittMovieStatus");

  try {
    if (status) {
      status.textContent = "Turimo gushakisha filime zifite uruhushya...";
    }

    const query =
      'collection:feature_films AND mediatype:movies';

    const api =
      "https://archive.org/advancedsearch.php?q=" +
      encodeURIComponent(query) +
      "&fl[]=identifier&fl[]=title&fl[]=year" +
      "&rows=40&page=1&output=json";

    const response = await fetch(api);

    if (!response.ok) {
      throw new Error("Movie search unavailable");
    }

    const data = await response.json();
    const records = data.response?.docs || [];

    const results = await Promise.all(
      records.slice(0, 25).map(async item => {
        try {
          const metadataResponse = await fetch(
            "https://archive.org/metadata/" +
            encodeURIComponent(item.identifier)
          );

          if (!metadataResponse.ok) return null;

          const metadata = await metadataResponse.json();
          const rights = String(
            metadata.metadata?.licenseurl ||
            metadata.metadata?.rights ||
            ""
          ).toLowerCase();

          // Only show films with recognizable reuse permissions.
          const allowed =
            rights.includes("publicdomain") ||
            rights.includes("public-domain") ||
            rights.includes("creativecommons.org/licenses/by/") ||
            rights.includes("creativecommons.org/licenses/by-sa/");

          if (!allowed) return null;

          const files = metadata.files || [];

          const mp4 = files.find(file =>
            file.name?.toLowerCase().endsWith(".mp4") &&
            !file.name.toLowerCase().includes("thumb") &&
            Number(file.size || 0) > 1000000
          );

          if (!mp4) return null;

          const videoUrl =
            "https://archive.org/download/" +
            encodeURIComponent(item.identifier) +
            "/" +
            mp4.name.split("/").map(encodeURIComponent).join("/");

          return {
            title: item.title || item.identifier,
            description:
              "Film yo mu bubiko bwa Internet Archive (" +
              (item.year || "umwaka utazwi") + ").",
            category: "classic",
            videoUrl,
            poster: "",
            source: "Internet Archive",
            license: "Reuse permission listed in archive metadata",
            pageUrl:
              "https://archive.org/details/" +
              encodeURIComponent(item.identifier)
          };

        } catch (error) {
          return null;
        }
      })
    );

    const permittedMovies = results.filter(Boolean);

    const existing = new Set(
      ittMovieList.map(movie => movie.title.toLowerCase())
    );

    permittedMovies.forEach(movie => {
      if (!existing.has(movie.title.toLowerCase())) {
        ittMovieList.push(movie);
      }
    });

    displayITMovies();

    if (status) {
      status.textContent = permittedMovies.length
        ? permittedMovies.length +
          " films zifite uruhushya zibonetse. Hitamo iyo ushaka kureba."
        : "Nta film ifite stream n'uruhushya byemejwe yabonetse ubu. Gerageza nyuma.";
    }

  } catch (error) {
    console.error("Movie loading error:", error);

    if (status) {
      status.textContent =
        "Filime ntizashoboye kuzanwa. Reba internet cyangwa ugerageze nyuma.";
    }
  }
}

  setupLanguages();
  registerPWA();

  console.log("ITT NEWS application loaded successfully.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startITTNews);
} else {
  startITTNews();
}
