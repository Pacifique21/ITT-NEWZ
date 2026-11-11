// ITT NEWS FILMS PLAYER

const films = [
  {
    title: "Big Buck Bunny",
    year: "2008",
    category: "Animation / Comedy",
    video: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.720p.vp9.webm",
    description: "A funny animated adventure from Blender Foundation.",
    credit: "Blender Foundation — CC BY 3.0",
    source: "https://peach.blender.org/about/"
  },
  {
    title: "Sintel",
    year: "2010",
    category: "Fantasy / Animation",
    video: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Sintel_movie_4K.webm/Sintel_movie_4K.webm.720p.vp9.webm",
    description: "An animated fantasy adventure from Blender Foundation.",
    credit: "Blender Foundation — CC BY 3.0",
    source: "https://studio.blender.org/films/sintel/"
  },
  {
    title: "Tears of Steel",
    year: "2012",
    category: "Science Fiction",
    video: "https://download.blender.org/demo/movies/ToS/tears_of_steel_720p.mov",
    description: "A science-fiction film made by Blender Institute.",
    credit: "Blender Foundation — CC BY 3.0",
    source: "https://mango.blender.org/"
  }
];

const filmGrid = document.getElementById("filmGrid");
const filmSearch = document.getElementById("filmSearch");
const filmPlayer = document.getElementById("filmPlayer");
const filmTitle = document.getElementById("filmTitle");
const filmDescription = document.getElementById("filmDescription");
const filmStatus = document.getElementById("filmStatus");
const filmCredit = document.getElementById("filmCredit");

function showFilm(film) {
  filmPlayer.pause();

  filmTitle.textContent = film.title;
  filmDescription.textContent =
    `${film.year} · ${film.category} — ${film.description}`;

  filmCredit.textContent = film.credit;
  filmStatus.textContent = "Turimo gufungura filime...";

  filmPlayer.src = film.video;
  filmPlayer.load();

  filmPlayer.play()
    .then(() => {
      filmStatus.textContent = "Filime iri gukinira muri ITT NEWS.";
    })
    .catch(error => {
      console.error("Film playback error:", error);
      filmStatus.textContent =
        "Filime ntiyafungutse. Gerageza indi cyangwa urebe internet yawe.";
    });
}

function renderFilms(list) {
  filmGrid.replaceChildren();

  if (list.length === 0) {
    filmGrid.textContent = "Nta filime ibonetse.";
    return;
  }

  list.forEach(film => {
    const card = document.createElement("article");
    card.className = "film-card";

    const title = document.createElement("h3");
    title.textContent = film.title;

    const details = document.createElement("p");
    details.textContent = `${film.year} · ${film.category}`;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "▶ REBA FILIME";

    button.addEventListener("click", () => {
      showFilm(film);
    });

    card.append(title, details, button);
    filmGrid.appendChild(card);
  });
}

filmSearch.addEventListener("input", () => {
  const search = filmSearch.value.toLowerCase();

  const results = films.filter(film =>
    `${film.title} ${film.category} ${film.year}`
      .toLowerCase()
      .includes(search)
  );

  renderFilms(results);
});

filmPlayer.addEventListener("error", () => {
  filmStatus.textContent =
    "Iyi video ntiyashoboye gukinwa. Bishobora guterwa na format cyangwa stream.";
});

filmPlayer.addEventListener("playing", () => {
  filmStatus.textContent = "Filime iri gukinira muri ITT NEWS.";
});

renderFilms(films);
