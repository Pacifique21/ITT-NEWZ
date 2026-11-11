"use strict";

const countrySelect = document.getElementById("countrySelect");
const loadCountryButton = document.getElementById("loadCountry");
const tvSearch = document.getElementById("tvSearch");
const tvGrid = document.getElementById("tvGrid");
const tvPlayer = document.getElementById("tvPlayer");
const tvStatus = document.getElementById("tvStatus");
const playingTitle = document.getElementById("playingTitle");

const radioPlayer = document.getElementById("radioPlayer");
const radioUrl = document.getElementById("radioUrl");
const playRadioButton = document.getElementById("playRadio");
const radioStatus = document.getElementById("radioStatus");
const radioTitle = document.getElementById("radioTitle");

let channels = [];
let hls = null;

function showTVStatus(message) {
  tvStatus.textContent = message;
}

function showRadioStatus(message) {
  radioStatus.textContent = message;
}

function validURL(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function parseM3U(text) {
  const lines = text.split(/\r?\n/);
  const result = [];
  let currentName = "";

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("#EXTINF")) {
      const comma = line.lastIndexOf(",");
      currentName = comma >= 0
        ? line.slice(comma + 1).trim()
        : "Unknown channel";
    } else if (
      line &&
      !line.startsWith("#") &&
      validURL(line)
    ) {
      result.push({
        name: currentName || "TV Channel",
        url: line
      });

      currentName = "";
    }
  }

  return result;
}

function renderChannels(list) {
  tvGrid.replaceChildren();

  if (!list.length) {
    const message = document.createElement("p");
    message.className = "muted";
    message.textContent = "Nta channel yabonetse. Gerageza ikindi gihugu.";
    tvGrid.appendChild(message);
    return;
  }

  list.forEach((channel) => {
    const card = document.createElement("article");
    card.className = "channel-card";

    const title = document.createElement("h3");
    title.textContent = channel.name;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "▶ Watch Channel";

    button.addEventListener("click", () => {
      playTV(channel);
    });

    card.append(title, button);
    tvGrid.appendChild(card);
  });
}

async function loadChannels() {
  const country = countrySelect.value;

  tvGrid.replaceChildren();
  showTVStatus("Turimo gushaka channels...");

  const playlistURL =
    `https://iptv-org.github.io/iptv/countries/${country}.m3u`;

  try {
    const response = await fetch(playlistURL, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Playlist error: ${response.status}`);
    }

    const text = await response.text();
    channels = parseM3U(text);

    renderChannels(channels);

    showTVStatus(
      `${channels.length} channels zabonetse. Hitamo imwe kugira ngo uyirebe.`
    );

    filterChannels();
  } catch (error) {
    console.error("TV playlist error:", error);

    channels = [];
    renderChannels([]);

    showTVStatus(
      "Ntibyashobotse kuzana channels. Reba internet cyangwa wongere ugerageze."
    );
  }
}

function stopCurrentTV() {
  if (hls) {
    hls.destroy();
    hls = null;
  }

  tvPlayer.pause();
  tvPlayer.removeAttribute("src");
  tvPlayer.load();
}

async function playTV(channel) {
  stopCurrentTV();

  playingTitle.textContent = channel.name;
  showTVStatus("Turimo gufungura channel...");

  const url = channel.url;
  const isHLS = /\.m3u8($|\?)/i.test(url);

  try {
    if (isHLS && window.Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false
      });

      hls.loadSource(url);
      hls.attachMedia(tvPlayer);

      hls.on(Hls.Events.MANIFEST_PARSED, async () => {
        showTVStatus("Channel yafungutse. Turimo gutangira amashusho...");

        try {
          await tvPlayer.play();
        } catch {
          showTVStatus("Kanda Play kuri video kugira ngo itangire.");
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error("HLS fatal error:", data);

          showTVStatus(
            "Iyi channel yanze gukina. Ishobora kuba idakora, ifunze, cyangwa itemera gukinirwa kuri website."
          );

          stopCurrentTV();
        }
      });

      return;
    }

    // Safari ishobora gukina HLS idakoresheje Hls.js.
    if (
      isHLS &&
      tvPlayer.canPlayType("application/vnd.apple.mpegurl")
    ) {
      tvPlayer.src = url;
    } else {
      // Direct MP4 cyangwa izindi formats browser yemera.
      tvPlayer.src = url;
    }

    tvPlayer.load();

    try {
      await tvPlayer.play();
      showTVStatus("Channel iri gukina.");
    } catch {
      showTVStatus(
        "Kanda Play kuri video. Niramuka yanze, stream ishobora kuba idakora cyangwa itemera browser."
      );
    }
  } catch (error) {
    console.error("TV playback error:", error);
    showTVStatus("Habaye ikibazo mu gufungura iyi channel.");
  }
}

function filterChannels() {
  const query = tvSearch.value.trim().toLowerCase();

  const filtered = channels.filter((channel) =>
    channel.name.toLowerCase().includes(query)
  );

  renderChannels(filtered);
}

// RADIO PLAYER

playRadioButton.addEventListener("click", async () => {
  const url = radioUrl.value.trim();

  if (!validURL(url)) {
    showRadioStatus(
      "Shyiramo URL nyayo itangirira kuri https:// cyangwa http://."
    );
    return;
  }

  radioPlayer.pause();
  radioPlayer.removeAttribute("src");
  radioPlayer.load();

  radioTitle.textContent = "ITT NEWS Radio";
  showRadioStatus("Turimo gufungura radio...");

  radioPlayer.src = url;
  radioPlayer.load();

  try {
    await radioPlayer.play();
    showRadioStatus("Radio iri gukina.");
  } catch (error) {
    console.error("Radio playback error:", error);

    showRadioStatus(
      "Radio yanze gukina. Reba niba iyi URL ari direct audio stream kandi yemera gukinirwa kuri website."
    );
  }
});

radioPlayer.addEventListener("error", () => {
  showRadioStatus(
    "Audio stream ntiyafungutse. URL ishobora kuba itari yo cyangwa server ikaba itayemera."
  );
});

// BUTTONS AND SEARCH

loadCountryButton.addEventListener("click", loadChannels);
tvSearch.addEventListener("input", filterChannels);

tvPlayer.addEventListener("playing", () => {
  showTVStatus("TV iri gukina.");
});

tvPlayer.addEventListener("waiting", () => {
  showTVStatus("TV iracyafungura amashusho...");
});

tvPlayer.addEventListener("error", () => {
  showTVStatus(
    "Video ntiyashoboye gukina. Gerageza indi channel."
  );
});

// LOAD RWANDA CHANNELS WHEN THE WEBSITE OPENS

loadChannels();
