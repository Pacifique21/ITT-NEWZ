
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);

  const tvGrid = $("#tvGrid");
  const rwandaTVGrid = $("#rwandaTVGrid");
  const countrySelect = $("#countrySelect");
  const tvSearch = $("#tvSearch");
  const tvPlayer = $("#tvPlayer");

  const radioPlayer = $("#radioPlayer");
  const radioFrame = $("#radioFrame");

  const PLAYLIST_URL =
    "https://iptv-org.github.io/iptv/countries/";

  let allChannels = [];
  let hlsPlayer = null;

  // Radio pages: these official pages may allow or block iframe embedding.
  // If a station blocks embedding, its website cannot be forced to play here.
  const radios = [
    {
      name: "Radio 10",
      page: "https://radiotv10.rw/radio/",
      stream: ""
    },
    {
      name: "Radio Rwanda",
      page: "https://www.rba.co.rw/",
      stream: ""
    },
    {
      name: "Magic FM",
      page: "https://www.rba.co.rw/radio/7/Magic-Fm",
      stream: ""
    },
    {
      name: "Flash FM",
      page: "https://flash.rw/home/",
      stream: ""
    },
    {
      name: "Kiss FM",
      page: "https://kissfm.rw/",
      stream: ""
    },
    {
      name: "KT Radio",
      page: "https://www.ktradio.rw/",
      stream: ""
    },
    {
      name: "Radio 1",
      page: "https://radio1.rw/",
      stream: ""
    },
    {
      name: "Isango Star",
      page: "https://isangostar.rw/",
      stream: ""
    },
    {
      name: "Royal FM",
      page: "https://www.royalfm.rw/stream",
      stream: ""
    },
    {
      name: "Radio Maria Rwanda",
      page: "https://www.radiomaria.rw/",
      stream: ""
    },
    {
      name: "B&B Kigali",
      page: "https://www.bbkigalifm.com/",
      stream: ""
    }
  ];

  function safeURL(value) {
    try {
      const url = new URL(value);

      if (url.protocol === "https:" || url.protocol === "http:") {
        return url.href;
      }
    } catch (error) {
      return "";
    }

    return "";
  }

  function showEmpty(container, message) {
    container.replaceChildren();

    const item = document.createElement("p");
    item.className = "empty";
    item.textContent = message;

    container.appendChild(item);
  }

  function makeCard(title, description, buttonText, action) {
    const card = document.createElement("article");
    card.className = "card";

    const heading = document.createElement("h3");
    heading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.textContent = description;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = buttonText;
    button.addEventListener("click", action);

    card.append(heading, paragraph, button);
    return card;
  }

  // Read public M3U playlists.
  function parseM3U(text) {
    const lines = text.split(/\r?\n/);
    const channels = [];
    let current = null;

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (line.startsWith("#EXTINF:")) {
        const name = line.split(",").pop().trim();
        const groupMatch = line.match(/group-title="([^"]*)"/i);

        current = {
          name: name || "TV Channel",
          group: groupMatch ? groupMatch[1] : "Television",
          url: ""
        };
      } else if (line && !line.startsWith("#") && current) {
        const url = safeURL(line);

        if (url) {
          current.url = url;
          channels.push(current);
        }

        current = null;
      }
    }

    return channels;
  }

  function stopTV() {
    if (hlsPlayer) {
      hlsPlayer.destroy();
      hlsPlayer = null;
    }

    tvPlayer.pause();
    tvPlayer.removeAttribute("src");
    tvPlayer.load();
  }

  function playTV(channel) {
    const url = safeURL(channel.url);

    if (!url) {
      $("#playerMessage").textContent =
        "Iyi channel nta link ifite.";
      return;
    }

    stopTV();

    $("#playingTitle").textContent = channel.name;
    $("#playerMessage").textContent =
      "Turimo kugerageza gukinisha iyi channel...";

    $("#externalTV").href = url;
    $("#externalTV").hidden = false;

    if (url.toLowerCase().includes(".m3u8")) {
      if (window.Hls && Hls.isSupported()) {
        hlsPlayer = new Hls();
        hlsPlayer.loadSource(url);
        hlsPlayer.attachMedia(tvPlayer);

        hlsPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
          tvPlayer.play().catch(() => {
            $("#playerMessage").textContent =
              "Kanda Play kuri video kugira ngo utangire.";
          });
        });

        hlsPlayer.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            $("#playerMessage").textContent =
              "Stream ntishoboye gukinirwa hano. Gerageza indi channel.";
          }
        });
      } else if (
        tvPlayer.canPlayType("application/vnd.apple.mpegurl")
      ) {
        tvPlayer.src = url;
        tvPlayer.play().catch(() => {
          $("#playerMessage").textContent =
            "Kanda Play kugira ngo utangire.";
        });
      } else {
        $("#playerMessage").textContent =
          "Browser yawe ntiyemera iyi video format.";
      }
    } else {
      tvPlayer.src = url;
      tvPlayer.play().catch(() => {
        $("#playerMessage").textContent =
          "Iyi stream yanze gukinira hano.";
      });
    }

    $("#live-tv").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function renderTV(channels, container) {
    container.replaceChildren();

    if (!channels.length) {
      showEmpty(container, "Nta channel yabonetse.");
      return;
    }

    channels.forEach((channel) => {
      const card = makeCard(
        channel.name,
        channel.group || "TV Channel",
        "▶ WATCH HERE",
        () => playTV(channel)
      );

      container.appendChild(card);
    });
  }

  function filterTV() {
    const query = tvSearch.value.trim().toLowerCase();

    const filtered = allChannels.filter((channel) =>
      channel.name.toLowerCase().includes(query)
    );

    renderTV(filtered, tvGrid);

    if (countrySelect.value === "rw") {
      renderTV(filtered, rwandaTVGrid);
    }
  }

  async function loadTV(countryCode) {
    const country = String(countryCode || "rw").toLowerCase();

    $("#tvStatus").textContent =
      "Turimo gushakisha TV...";

    showEmpty(tvGrid, "Turimo kuzana channels...");

    try {
      const response = await fetch(
        PLAYLIST_URL + encodeURIComponent(country) + ".m3u"
      );

      if (!response.ok) {
        throw new Error("Playlist ntibonetse");
      }

      const playlist = await response.text();
      allChannels = parseM3U(playlist);

      if (!allChannels.length) {
        throw new Error("Nta channels zabonetse");
      }

      filterTV();

      $("#tvStatus").textContent =
        allChannels.length + " channels zabonetse.";

      if (country === "rw") {
        renderTV(allChannels, rwandaTVGrid);
      } else {
        showEmpty(
          rwandaTVGrid,
          "Hitamo Rwanda kugira ngo ubone Rwanda TV."
        );
      }
    } catch (error) {
      allChannels = [];

      showEmpty(
        tvGrid,
        "TV ntizabonetse. Reba internet cyangwa ugerageze nyuma."
      );

      showEmpty(
        rwandaTVGrid,
        "Rwanda TV ntibonetse muri aka kanya."
      );

      $("#tvStatus").textContent =
        "Habaye ikibazo cyo kubona TV playlist.";

      console.error("TV loading error:", error);
    }
  }

  // Radio playback: use direct stream when a verified URL is available.
  // Otherwise show the station's official webpage inside the page.
  function playRadio(radio) {
    const pageURL = safeURL(radio.page);
    const streamURL = safeURL(radio.stream);

    $("#radioPlaying").textContent = radio.name;
    $("#radioExternal").hidden = true;

    radioPlayer.pause();
    radioPlayer.removeAttribute("src");
    radioPlayer.load();
    radioPlayer.hidden = true;

    radioFrame.hidden = true;
    radioFrame.removeAttribute("src");

    if (streamURL) {
      radioPlayer.hidden = false;
      radioPlayer.src = streamURL;

      radioPlayer.play().then(() => {
        $("#radioMessage").textContent =
          "Uri kumva " + radio.name + " muri ITT NEWS.";
      }).catch(() => {
        $("#radioMessage").textContent =
          "Kanda Play kuri radio player kugira ngo utangire.";
      });

      return;
    }

    if (pageURL) {
      radioFrame.hidden = false;
      radioFrame.src = pageURL;

      $("#radioMessage").textContent =
        "Turagerageza kwerekana urubuga rwa " +
        radio.name +
        " hano. Niba urubuga rutarwemera kwinjizwa muri ITT NEWS, ntiruzagaragara.";

      $("#radioExternal").href = pageURL;
      $("#radioExternal").hidden = false;
    }
  }

  function renderRadios(search = "") {
    const query = search.trim().toLowerCase();

    const filtered = radios.filter((radio) =>
      radio.name.toLowerCase().includes(query)
    );

    const radioGrid = $("#radioGrid");
    radioGrid.replaceChildren();

    if (!filtered.length) {
      showEmpty(radioGrid, "Nta radio yabonetse.");
      return;
    }

    filtered.forEach((radio) => {
      const card = makeCard(
        radio.name,
        "Umva iyi radio hano niba yemera embedded playback.",
        "▶ LISTEN HERE",
        () => playRadio(radio)
      );

      radioGrid.appendChild(card);
    });
  }

  // Mobile navigation
  $("#menuToggle").addEventListener("click", () => {
    const nav = $("#mainNav");
    const isOpen = nav.classList.toggle("open");

    $("#menuToggle").setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });

  $("#mainNav").querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      $("#mainNav").classList.remove("open");
      $("#menuToggle").setAttribute("aria-expanded", "false");
    });
  });

  $("#year").textContent = new Date().getFullYear();

  $("#loadCountry").addEventListener("click", () => {
    loadTV(countrySelect.value);
  });

  countrySelect.addEventListener("change", () => {
    loadTV(countrySelect.value);
  });

  tvSearch.addEventListener("input", filterTV);

  $("#radioSearch").addEventListener("input", (event) => {
    renderRadios(event.target.value);
  });

  renderRadios();
  loadTV("rw");
});
