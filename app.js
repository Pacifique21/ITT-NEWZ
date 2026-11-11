
"use strict";

/* =====================================
   ITT NEWS - MAIN APPLICATION
===================================== */

const IPTV_COUNTRY_URL =
  "https://iptv-org.github.io/iptv/countries/";

const COUNTRY_LIST_URL =
  "https://iptv-org.github.io/api/countries.json";

const $ = (selector) => document.querySelector(selector);

let allTV = [];
let hlsInstance = null;

/* =====================================
   RWANDA RADIO DIRECTORY
   Official station pages
===================================== */

const rwandaRadios = [
  {
    name: "Radio Rwanda",
    description: "Rwanda Broadcasting Agency",
    url: "https://www.rba.co.rw/"
  },
  {
    name: "Magic FM",
    description: "RBA radio station",
    url: "https://www.rba.co.rw/"
  },
  {
    name: "Radio Rubavu",
    description: "RBA regional radio",
    url: "https://www.rba.co.rw/"
  },
  {
    name: "Radio Nyagatare",
    description: "RBA regional radio",
    url: "https://www.rba.co.rw/"
  },
  {
    name: "Radio Inteko",
    description: "RBA radio station",
    url: "https://www.rba.co.rw/"
  },
  {
    name: "Radio Huye",
    description: "RBA regional radio",
    url: "https://www.rba.co.rw/"
  },
  {
    name: "Radio Musanze",
    description: "RBA regional radio",
    url: "https://www.rba.co.rw/"
  },
  {
    name: "Radio Rusizi",
    description: "RBA regional radio",
    url: "https://www.rba.co.rw/"
  },
  {
    name: "Radio 10",
    description: "Radio and television",
    url: "https://radiotv10.rw/radio/"
  },
  {
    name: "Kiss FM",
    description: "Rwanda radio",
    url: "https://www.kissfm.rw/"
  },
  {
    name: "KT Radio",
    description: "Rwanda radio",
    url: "https://www.ktradio.rw/"
  },
  {
    name: "Radio 1",
    description: "Rwanda radio",
    url: "https://radio1.rw/"
  },
  {
    name: "Flash FM",
    description: "Rwanda radio",
    url: "https://flashfm.rw/"
  },
  {
    name: "Isango Star",
    description: "Rwanda radio",
    url: "https://isangostar.rw/"
  },
  {
    name: "Royal FM",
    description: "Rwanda radio",
    url: "https://royalfm.rw/"
  },
  {
    name: "Radio Maria Rwanda",
    description: "Rwanda radio",
    url: "https://www.radiomaria.rw/"
  },
  {
    name: "B&B Kigali",
    description: "Rwanda radio",
    url: "https://www.bbkigalifm.com/"
  }
];

/* =====================================
   SAFE URL
===================================== */

function safeURL(value) {
  try {
    const url = new URL(value);

    if (
      url.protocol === "https:" ||
      url.protocol === "http:"
    ) {
      return url.href;
    }
  } catch (error) {
    return "";
  }

  return "";
}

/* =====================================
   M3U PLAYLIST READER
===================================== */

function parseM3U(text) {
  const lines = text.split(/\r?\n/);
  const channels = [];

  let current = null;

  for (const line of lines) {
    const item = line.trim();

    if (item.startsWith("#EXTINF:")) {
      const name = item.split(",").pop().trim();

      const logo = item.match(/tvg-logo="([^"]*)"/i);
      const group = item.match(/group-title="([^"]*)"/i);

      current = {
        name: name || "TV Channel",
        logo: logo ? logo[1] : "",
        group: group ? group[1] : "Television",
        url: ""
      };

    } else if (
      item &&
      !item.startsWith("#") &&
      current
    ) {
      const url = safeURL(item);

      if (url) {
        current.url = url;
        channels.push(current);
      }

      current = null;
    }
  }

  return channels;
}

/* =====================================
   EMPTY MESSAGE
===================================== */

function showEmpty(container, message) {
  container.innerHTML = "";

  const paragraph = document.createElement("p");
  paragraph.className = "empty";
  paragraph.textContent = message;

  container.appendChild(paragraph);
}

/* =====================================
   CREATE CHANNEL CARD
===================================== */

function makeCard(title, description, buttons) {
  const card = document.createElement("article");
  card.className = "channel-card";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.textContent = description;

  card.appendChild(heading);
  card.appendChild(paragraph);

  buttons.forEach((item) => {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = item.label;

    button.addEventListener("click", item.action);

    card.appendChild(button);
  });

  return card;
}

/* =====================================
   TV PLAYER
===================================== */

function stopTV() {
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }

  const player = $("#tvPlayer");

  player.pause();
  player.removeAttribute("src");
  player.load();
}

function playTV(channel) {
  const url = safeURL(channel.url);

  if (!url) {
    return;
  }

  stopTV();

  const player = $("#tvPlayer");

  $("#playingTitle").textContent = channel.name;

  $("#playerMessage").textContent =
    "Turimo kugerageza gufungura iyi televiziyo...";

  const external = $("#externalTV");

  external.href = url;
  external.hidden = false;

  if (url.toLowerCase().includes(".m3u8")) {

    if (
      window.Hls &&
      Hls.isSupported()
    ) {
      hlsInstance = new Hls();

      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(player);

      hlsInstance.on(
        Hls.Events.MANIFEST_PARSED,
        () => {
          player.play().catch(() => {
            $("#playerMessage").textContent =
              "Kanda Play kugira ngo utangire kureba.";
          });
        }
      );

      hlsInstance.on(
        Hls.Events.ERROR,
        (event, data) => {
          if (data.fatal) {
            $("#playerMessage").textContent =
              "Iyi stream yanze gukinirwa hano. Fungura channel hanze.";
          }
        }
      );

    } else if (
      player.canPlayType(
        "application/vnd.apple.mpegurl"
      )
    ) {
      player.src = url;

      player.play().catch(() => {
        $("#playerMessage").textContent =
          "Kanda Play kugira ngo utangire.";
      });

    } else {
      $("#playerMessage").textContent =
        "Browser ntishyigikiye iyi video format.";
    }

  } else {
    player.src = url;

    player.play().catch(() => {
      $("#playerMessage").textContent =
        "Stream ntikinye hano. Gerageza link yo hanze.";
    });
  }

  $("#live-tv").scrollIntoView({
    behavior: "smooth"
  });
}

/* =====================================
   DISPLAY TV CHANNELS
===================================== */

function renderTV(channels, container) {
  container.innerHTML = "";

  if (!channels.length) {
    showEmpty(
      container,
      "Nta televiziyo yabonetse."
    );
    return;
  }

  channels.forEach((channel) => {
    const card = makeCard(
      channel.name,
      channel.group || "TV Channel",
      [
        {
          label: "▶ WATCH LIVE",
          action: () => playTV(channel)
        }
      ]
    );

    container.appendChild(card);
  });
}

/* =====================================
   LOAD COUNTRY CHANNELS
===================================== */

async function loadTV(countryCode) {
  const status = $("#tvStatus");

  status.textContent =
    "Turimo gushakisha televiziyo...";

  try {
    const response = await fetch(
      IPTV_COUNTRY_URL +
      encodeURIComponent(countryCode.toLowerCase()) +
      ".m3u"
    );

    if (!response.ok) {
      throw new Error("Playlist ntibonetse");
    }

    const playlist = await response.text();

    allTV = parseM3U(playlist);

    filterTV();

    status.textContent =
      allTV.length +
      " channels zabonetse muri playlist y'iki gihugu.";

    if (countryCode.toLowerCase() === "rw") {
      renderTV(allTV, $("#rwandaTVGrid"));
    }

  } catch (error) {
    console.error("TV error:", error);

    status.textContent =
      "Ntibyashobotse kubona channels. Reba internet wongere ugerageze.";

    showEmpty(
      $("#tvGrid"),
      "Playlist ntibonetse. Gerageza nyuma."
    );
  }
}

/* =====================================
   FILTER TV
===================================== */

function filterTV() {
  const query = $("#tvSearch").value
    .trim()
    .toLowerCase();

  const filtered = allTV.filter((channel) =>
    channel.name.toLowerCase().includes(query)
  );

  renderTV(filtered, $("#tvGrid"));

  if ($("#countrySelect").value === "rw") {
    renderTV(filtered, $("#rwandaTVGrid"));
  }
}

/* =====================================
   LOAD COUNTRIES
===================================== */

async function loadCountries() {
  try {
    const response = await fetch(COUNTRY_LIST_URL);

    if (!response.ok) {
      throw new Error("Country list ntibonetse");
    }

    const countries = await response.json();

    const select = $("#countrySelect");

    countries
      .filter((country) => country.code && country.name)
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      )
      .forEach((country) => {
        const option = document.createElement("option");

        option.value = country.code.toLowerCase();
        option.textContent = country.name;

        select.appendChild(option);
      });

    select.value = "rw";

  } catch (error) {
    console.warn(
      "Countries ntizibonetse. Rwanda iracyahari."
    );
  }
}

/* =====================================
   RWANDA RADIO DIRECTORY
===================================== */

function renderRadios(search = "") {
  const grid = $("#radioGrid");

  grid.innerHTML = "";

  const query = search.toLowerCase();

  const matches = rwandaRadios.filter((radio) =>
    radio.name.toLowerCase().includes(query)
  );

  if (!matches.length) {
    showEmpty(
      grid,
      "Nta radio ihuye n'ibyo washakishije."
    );

    return;
  }

  matches.forEach((radio) => {
    const card = makeCard(
      radio.name,
      radio.description,
      [
        {
          label: "🎧 LISTEN",
          action: () => {
            window.open(
              radio.url,
              "_blank",
              "noopener"
            );
          }
        }
      ]
    );

    grid.appendChild(card);
  });
}

/* =====================================
   RADIO PLAYER
===================================== */

function setupRadioPlayer() {
  const player = $("#radioPlayer");

  player.addEventListener("error", () => {
    $("#radioMessage").textContent =
      "Radio stream ntibonetse. Gerageza urubuga rwa radio.";
  });
}

/* =====================================
   INITIALIZE APP
===================================== */

async function startApp() {
  $("#year").textContent =
    new Date().getFullYear();

  renderRadios();

  setupRadioPlayer();

  $("#loadCountry").addEventListener(
    "click",
    () => {
      loadTV($("#countrySelect").value);
    }
  );

  $("#countrySelect").addEventListener(
    "change",
    () => {
      loadTV($("#countrySelect").value);
    }
  );

  $("#tvSearch").addEventListener(
    "input",
    filterTV
  );

  $("#radioSearch").addEventListener(
    "input",
    (event) => {
      renderRadios(event.target.value);
    }
  );

  await loadCountries();

  await loadTV("rw");
}

document.addEventListener(
  "DOMContentLoaded",
  startApp
);
