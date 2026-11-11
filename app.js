
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);

  const tvVideo = $("tvVideo");
  const tvPlaceholder = $("tvPlaceholder");
  const tvStatus = $("tvStatus");
  const radioAudio = $("radioAudio");
  const radioStatus = $("radioStatus");

  $("year").textContent = new Date().getFullYear();

  /*
   * Add only verified, authorized direct stream URLs here.
   * TV: HLS .m3u8 or supported direct video URL.
   * Radio: direct MP3/AAC/AAC+ stream URL.
   *
   * Official webpage URLs are NOT direct stream URLs.
   */

  const tvChannels = [
    {
      name: "Rwanda TV",
      country: "Rwanda",
      type: "page",
      url: "https://www.rba.co.rw/"
    },
    {
      name: "Flash TV",
      country: "Rwanda",
      type: "page",
      url: "https://flash.rw/"
    },
    {
      name: "TV10",
      country: "Rwanda",
      type: "page",
      url: "https://radiotv10.rw/"
    }
  ];

  const radioStations = [
    {
      name: "Radio Rwanda",
      country: "Rwanda",
      type: "page",
      url: "https://www.rba.co.rw/"
    },
    {
      name: "Flash FM",
      country: "Rwanda",
      type: "page",
      url: "https://flash.rw/"
    },
    {
      name: "Radio 10",
      country: "Rwanda",
      type: "page",
      url: "https://radiotv10.rw/radio/"
    }
  ];

  let activeHls = null;

  function status(element, message) {
    if (element) element.textContent = message;
  }

  function stopTV() {
    if (activeHls) {
      activeHls.destroy();
      activeHls = null;
    }

    tvVideo.pause();
    tvVideo.removeAttribute("src");
    tvVideo.load();
    tvVideo.style.display = "none";
  }

  function playTV(channel) {
    stopTV();

    if (channel.type === "page") {
      tvPlaceholder.style.display = "flex";
      tvPlaceholder.querySelector("p").textContent =
        channel.name + " ntirabona direct stream yemejwe muri player.";

      status(
        tvStatus,
        "Iyi ni official website, si direct TV stream. Ishobora kudashobora gukinirwa muri ITT NEWS."
      );
      return;
    }

    tvPlaceholder.style.display = "none";
    tvVideo.style.display = "block";

    const url = channel.url;
    const isHls = /\.m3u8($|\?)/i.test(url);

    if (isHls && window.Hls && Hls.isSupported()) {
      activeHls = new Hls();
      activeHls.loadSource(url);
      activeHls.attachMedia(tvVideo);

      activeHls.on(Hls.Events.MANIFEST_PARSED, () => {
        status(tvStatus, "Stream yiteguye. Kanda Play.");
      });

      activeHls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          status(tvStatus, "Stream ntiyashoboye gukina. Reba URL cyangwa uburenganzira bwa stream.");
          stopTV();
          tvPlaceholder.style.display = "flex";
        }
      });
    } else if (tvVideo.canPlayType("application/vnd.apple.mpegurl")) {
      tvVideo.src = url;
    } else {
      tvVideo.src = url;
    }

    tvVideo.play().catch(() => {
      status(tvStatus, "Kanda Play kugira ngo utangire kureba.");
    });
  }

  function playRadio(station) {
    radioAudio.pause();
    radioAudio.removeAttribute("src");
    radioAudio.load();

    if (station.type === "page") {
      $("radioName").textContent = station.name;
      $("radioCountry").textContent = station.country;
      status(
        radioStatus,
        "Nta direct audio stream yemejwe iraboneka kuri iyi station. Official page iraboneka kuri link iri hasi."
      );

      let link = $("radioOfficialLink");

      if (!link) {
        link = document.createElement("a");
        link.id = "radioOfficialLink";
        link.className = "red-button";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Fungura Radio official page";
        radioAudio.after(link);
      }

      link.href = station.url;
      return;
    }

    const link = $("radioOfficialLink");
    if (link) link.remove();

    $("radioName").textContent = station.name;
    $("radioCountry").textContent = station.country;

    radioAudio.src = station.url;
    radioAudio.load();

    radioAudio.play().then(() => {
      status(radioStatus, "Radio iri gukina.");
    }).catch(() => {
      status(radioStatus, "Kanda Play kuri audio player kugira ngo wumve radio.");
    });
  }

  function renderStations(items, container, type) {
    container.replaceChildren();

    if (!items.length) {
      const empty = document.createElement("p");
      empty.textContent = "Nta muyoboro wabonetse.";
      container.appendChild(empty);
      return;
    }

    items.forEach(item => {
      const button = document.createElement("button");
      button.className = "station-button";
      button.type = "button";

      const details = document.createElement("span");
      const name = document.createElement("strong");
      const country = document.createElement("small");

      name.textContent = item.name;
      country.textContent = item.country;

      details.append(name, country);

      const action = document.createElement("span");
      action.textContent = type === "tv" ? "WATCH ▶" : "LISTEN ▶";

      button.append(details, action);

      button.addEventListener("click", () => {
        if (type === "tv") playTV(item);
        else playRadio(item);
      });

      container.appendChild(button);
    });
  }

  renderStations(tvChannels, $("tvChannels"), "tv");
  renderStations(radioStations, $("radioStations"), "radio");

  function search(input, items, container, type) {
    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();

      const results = items.filter(item =>
        (item.name + " " + item.country).toLowerCase().includes(query)
      );

      renderStations(results, container, type);
    });
  }

  search($("tvSearch"), tvChannels, $("tvChannels"), "tv");
  search($("radioSearch"), radioStations, $("radioStations"), "radio");

  $("menuToggle").addEventListener("click", () => {
    $("navigation").classList.toggle("active");
  });

  $("navigation").querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      $("navigation").classList.remove("active");
    });
  });

  window.addEventListener("beforeunload", () => {
    if (activeHls) activeHls.destroy();
  });

  console.log("ITT NEWS media player initialized.");
});
