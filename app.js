
"use strict";

/* ITT NEWS - MAIN APPLICATION */

const ITT = window.ITT_CONFIG || window.ITT_CONFIG || {};

const $ = (selector) => document.querySelector(selector);

function safeLink(url) {
  try {
    const parsed = new URL(url, window.location.href);
    return ["https:", "http:"].includes(parsed.protocol)
      ? parsed.href
      : "";
  } catch {
    return "";
  }
}

function createCard(item, type) {
  const card = document.createElement("article");
  card.className = "card";

  const title = item.title || item.name || "ITT NEWS";
  const description = item.description || item.summary || "";
  const image = safeLink(item.image || item.thumbnail || "");
  const link = safeLink(item.url || item.link || "");
  const stream = safeLink(item.stream || item.streamUrl || "");

  if (image) {
    const img = document.createElement("img");
    img.src = image;
    img.alt = title;
    img.loading = "lazy";
    card.appendChild(img);
  }

  const heading = document.createElement("h3");
  heading.textContent = title;
  card.appendChild(heading);

  if (description) {
    const paragraph = document.createElement("p");
    paragraph.textContent = description;
    card.appendChild(paragraph);
  }

  if (type === "radio" && stream) {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "none";
    audio.src = stream;
    audio.style.width = "100%";
    card.appendChild(audio);
  }

  if (type === "movie" && stream) {
    const video = document.createElement("video");
    video.controls = true;
    video.preload = "metadata";
    video.src = stream;
    video.style.width = "100%";
    video.style.borderRadius = "9px";
    card.appendChild(video);
  }

  if (link) {
    const a = document.createElement("a");
    a.href = link;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "Read more";
    card.appendChild(a);
  }

  return card;
}

function renderItems(selector, items, type) {
  const container = $(selector);
  if (!container) return;

  container.replaceChildren();

  if (!Array.isArray(items) || items.length === 0) {
    const message = document.createElement("p");
    message.className = "note";
    message.textContent = "Content will appear here when added to config.js.";
    container.appendChild(message);
    return;
  }

  items.forEach(item => {
    container.appendChild(createCard(item, type));
  });
}

/* NEWS */

function setupNews() {
  const news = Array.isArray(ITT.news) ? ITT.news : [];

  renderItems("#newsGrid", news, "news");

  document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(b => {
        b.classList.remove("active");
      });

      button.classList.add("active");

      const category = button.dataset.category || "all";

      const filtered = category === "all"
        ? news
        : news.filter(item =>
            String(item.category || "").toLowerCase() === category.toLowerCase()
          );

      renderItems("#newsGrid", filtered, "news");
    });
  });
}

/* SPORTS */

function setupSports() {
  const sports = Array.isArray(ITT.sports) ? ITT.sports : [];

  if (sports.length) {
    renderItems("#sports .panel", sports, "sports");
  }
}

/* RADIO */

function setupRadio() {
  const stations = ITT.radio || ITT.radios || [];
  renderItems("#radioGrid", stations, "radio");
}

/* MOVIES */

function setupMovies() {
  const movies = Array.isArray(ITT.movies) ? ITT.movies : [];
  renderItems("#movieGrid", movies, "movie");
}

/* LATEST NEWS VIDEOS */

function setupNewsVideos() {
  const section = $("#newsVideos");
  if (!section) return;

  section.classList.add("news-videos");

  section.innerHTML = `
    <div class="news-videos-heading">
      <span>ITT NEWS / VIDEO CENTER</span>
      <h2>📺 LIVE TV & LATEST NEWS VIDEOS</h2>
      <p>Amakuru mashya aturutse kuri televiziyo zitandukanye.</p>
    </div>

    <div class="news-videos-grid">

      <article class="news-video-card">
        <h3>🇷🇼 TV10 RWANDA</h3>
        <iframe
          src="https://www.youtube.com/embed/videoseries?list=UU4p7042h6Fj_cOnXIzS_sag"
          title="TV10 Rwanda latest videos"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen>
        </iframe>
        <a href="https://www.youtube.com/@officialradiotv10rwanda/videos"
           target="_blank" rel="noopener noreferrer">
          Reba andi makuru ya TV10
        </a>
      </article>

      <article class="news-video-card">
        <h3>🌍 BBC NEWS</h3>
        <iframe
          src="https://www.youtube.com/embed/videoseries?list=UU16niRr50-MSBwiO3YDb3RA"
          title="BBC News latest videos"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen>
        </iframe>
        <a href="https://www.youtube.com/@BBCNews/videos"
           target="_blank" rel="noopener noreferrer">
          Reba andi makuru ya BBC
        </a>
      </article>

    </div>
  `;
}

/* LANGUAGE SELECTOR */

function setupLanguage() {
  const selector = $("#language");
  if (!selector) return;

  selector.addEventListener("change", () => {
    document.documentElement.lang = selector.value;
  });
}

/* FOOTER YEAR */

function setupYear() {
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
}

/* START WEBSITE */

function startITTNews() {
  setupNews();
  setupSports();
  setupRadio();
  setupMovies();
  setupNewsVideos();
  setupLanguage();
  setupYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startITTNews);
} else {
  startITTNews();
}
