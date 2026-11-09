/*
  ITT NEWS CONFIGURATION
  Add only authorized sources. Never put secret API keys in this public file.
  Public RSS URLs and official public stream URLs may be listed here.
  Private API keys belong in Cloudflare Worker Secrets.
*/
window.ITT_CONFIG = {
  newsFeeds: [
    // Example format: { name: "Publisher", url: "https://publisher.example/rss", category: "Rwanda" }
  ],
  radioStations: [
    // Example format: { name: "Radio name", streamUrl: "https://official-stream-url", website: "https://official-site" }
  ],
  sportsProvider: {
    // Add a licensed sports-data API through a backend Worker. Do not expose its API key here.
    enabled: false
  },
  movies: [
    // Example format: { title: "Film title", access: "free", poster: "https://...", watchUrl: "https://authorized-player-url" }
  ],
  translation: {
    // Connect a secure backend endpoint, e.g. /api/translate
    endpoint: "/api/translate",
    enabled: false
  }
};