
"use strict";

document.addEventListener("DOMContentLoaded", function () {

  const $ = (selector) => document.querySelector(selector);

  const tvGrid = $("#tvGrid");
  const rwandaTVGrid = $("#rwandaTVGrid");
  const countrySelect = $("#countrySelect");
  const tvSearch = $("#tvSearch");
  const tvPlayer = $("#tvPlayer");

  let allChannels = [];
  let hls = null;

  const playlistURL =
    "https://iptv-org.github.io/iptv/countries/";

  const radios = [
    ["Radio Rwanda", "https://www.rba.co.rw/"],
    ["Magic FM", "https://www.rba.co.rw/"],
    ["Radio 10", "https://radiotv10.rw/radio/"],
    ["Kiss FM", "https://www.kissfm.rw/"],
    ["KT Radio", "https://www.ktradio.rw/"],
    ["Radio 1", "https://radio1.rw/"],
    ["Flash FM", "https://flashfm.rw/"],
    ["Isango Star", "https://isangostar.rw/"],
    ["Royal FM", "https://royalfm.rw/"],
    ["Radio Maria Rwanda", "https://www.radiomaria.rw/"],
    ["B&B Kigali", "https://www.bbkigalifm.com/"]
  ];

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

  function showEmpty(container, message) {
    container.replaceChildren();

    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = message;

    container.appendChild(p);
  }

  function parseM3U(text) {
    const lines = text.split(/\r?\n/);
    const channels = [];

    let current = null;

    lines.forEach(function (line) {

      line = line.trim();

      if (line.startsWith("#EXTINF:")) {

        const name = line.split(",").pop().trim();

        const groupMatch =
          line.match(/group-title="([^"]*)"/i);

        current = {
          name: name || "TV Channel",
          group: groupMatch ? groupMatch[1] : "Television",
          url: ""
        };

      } else if (
        line &&
        !line.startsWith("#") &&
        current
      ) {

        const url = safeURL(line);

        if (url) {
          current.url = url;
          channels.push(current);
        }

        current = null;
      }

    });

    return channels;
  }

  function createCard(title, description, label, action) {

    const card = document.createElement("article");
    card.className = "card";

    const heading = document.createElement("h3");
    heading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.textContent = description;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", action);

    card.append(heading, paragraph, button);

    return card;
  }

  function stopTV() {

    if (hls) {
      hls.destroy();
      hls = null;
    }

    tvPlayer.pause();
    tvPlayer.removeAttribute("src");
    tvPlayer.load();
  }

  function playTV(channel) {

    const url = safeURL(channel.url);

    if (!url) {
      $("#playerMessage").textContent =
        "Channel link ntiboneka.";
      return;
    }

    stopTV();

    $("#playingTitle").textContent = channel.name;
    $("#playerMessage").textContent =
      "Turimo kugerageza gufungura channel...";

    $("#externalTV").href = url;
    $("#externalTV").hidden = false;

    if (url.toLowerCase().includes(".m3u8")) {

      if (window.Hls && Hls.isSupported()) {

        hls = new Hls();

        hls.loadSource(url);
        hls.attachMedia(tvPlayer);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          tvPlayer.play().catch(function () {
            $("#playerMessage").textContent =
              "Kanda Play kugira ngo utangire.";
          });
        });

        hls.on(Hls.Events.ERROR, function (_event, data) {
          if (data.fatal) {
            $("#playerMessage").textContent =
              "Stream ntikinirwa hano. Gerageza kuyifungura hanze.";
          }
        });

      } else if (
        tvPlayer.canPlayType("application/vnd.apple.mpegurl")
      ) {

        tvPlayer.src = url;
        tvPlayer.play().catch(function () {});

      } else {

        $("#playerMessage").textContent =
          "Browser ntiyemera iyi video format.";

      }

    } else {

      tvPlayer.src = url;

      tvPlayer.play().catch(function () {
        $("#playerMessage").textContent =
          "Stream ntikinirwa hano. Fungura link yayo hanze.";
      });

    }
  }

  function renderTV(channels, container) {

    container.replaceChildren();

    if (!channels.length) {
      showEmpty(container, "Nta channel yabonetse.");
      return;
    }

    channels.forEach(function (channel) {

      const card = createCard(
        channel.name,
        channel.group,
        "▶ WATCH LIVE",
        function () {
          playTV(channel);
        }
      );

      container.appendChild(card);

    });
  }

  function filterTV() {

    const query = tvSearch.value.toLowerCase().trim();

    const filtered = allChannels.filter(function (channel) {
      return channel.name.toLowerCase().includes(query);
    });

    renderTV(filtered, tvGrid);

    if (countrySelect.value === "rw") {
      renderTV(filtered, rwandaTVGrid);
    }
  }

  async function loadTV(country) {

    $("#tvStatus").textContent =
      "Turimo gushakisha channels...";

    showEmpty(tvGrid, "Loading...");

    try {

      const response = await fetch(
        playlistURL + encodeURIComponent(country) + ".m3u"
      );

      if (!response.ok) {
        throw new Error("Playlist ntiyabonetse");
      }

      const text = await response.text();

      allChannels = parseM3U(text);

      if (!allChannels.length) {
        throw new Error("Nta channel yabonetse");
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
        "Ntibyashobotse kubona channels. Reba internet wongere ugerageze."
      );

      showEmpty(
        rwandaTVGrid,
        "Rwanda TV ntibonetse muri aka kanya."
      );

      $("#tvStatus").textContent =
        "Habaye ikibazo mu kubona playlist.";

      console.error(error);
    }
  }

  function renderRadios(search = "") {

    const query = search.toLowerCase().trim();

    const filtered = radios.filter(function (radio) {
      return radio[0].toLowerCase().includes(query);
    });

    const radioGrid = $("#radioGrid");

    radioGrid.replaceChildren();

    if (!filtered.length) {
      showEmpty(radioGrid, "Nta radio yabonetse.");
      return;
    }

    filtered.forEach(function (radio) {

      const card = createCard(
        radio[0],
        "Fungura urubuga rwa radio kugira ngo wumve ibiganiro.",
        "🎧 LISTEN",
        function () {

          const url = safeURL(radio[1]);

          if (url) {
            window.open(
              url,
              "_blank",
              "noopener,noreferrer"
            );
          }

          $("#radioPlaying").textContent = radio[0];

          $("#radioMessage").textContent =
            "Urubuga rwa radio rufunguwe. Direct audio stream ntirashyizweho.";
        }
      );

      radioGrid.appendChild(card);

    });
  }

  $("#year").textContent = new Date().getFullYear();

  $("#loadCountry").addEventListener("click", function () {
    loadTV(countrySelect.value);
  });

  countrySelect.addEventListener("change", function () {
    loadTV(countrySelect.value);
  });

  tvSearch.addEventListener("input", filterTV);

  $("#radioSearch").addEventListener("input", function (event) {
    renderRadios(event.target.value);
  });

  $("#menuToggle").addEventListener("click", function () {
    $("#mainNav").classList.toggle("open");
  });

  $("#mainNav").querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      $("#mainNav").classList.remove("open");
    });
  });

  renderRadios();
  loadTV("rw");

});
