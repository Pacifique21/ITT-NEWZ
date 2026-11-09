const cfg=window.ITT_CONFIG||{news:[],radios:[],movies:[]};
const $=s=>document.querySelector(s);
function renderNews(category="all"){
 const items=cfg.news.filter(n=>category==="all"||n.category===category);
 $("#newsGrid").innerHTML=items.map(n=>`<article class="card"><span class="tag">${escapeHtml(n.category)}</span><h3>${escapeHtml(n.title)}</h3><p>${escapeHtml(n.summary)}</p><small>${escapeHtml(n.source)}</small><p><a href="${safeUrl(n.url)}" target="_blank" rel="noopener">Soma ku isoko</a></p></article>`).join("")||"<p>Nta nkuru ihari.</p>";
}
function renderRadios(){ $("#radioGrid").innerHTML=cfg.radios.map(r=>`<article class="card"><span class="tag">RADIO / MEDIA</span><h3>${escapeHtml(r.name)}</h3><p>${escapeHtml(r.description)}</p><a href="${safeUrl(r.url)}" target="_blank" rel="noopener">Fungura urubuga rwemewe</a></article>`).join("");}
function renderMovies(){ $("#movieGrid").innerHTML=cfg.movies.map(m=>`<article class="card"><span class="tag">${escapeHtml(m.type)}</span><h3>${escapeHtml(m.title)}</h3><p>${escapeHtml(m.description)}</p>${m.videoUrl?`<video controls preload="none" style="width:100%" src="${safeUrl(m.videoUrl)}"></video>`:"<small>Video ntirashyirwamo.</small>"}</article>`).join("");}
function safeUrl(v){try{const u=new URL(v);return ["https:","http:"].includes(u.protocol)?u.href:"#"}catch{return "#"}}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderNews(b.dataset.category)}));
$("#refreshNews").addEventListener("click",()=>renderNews(document.querySelector(".filter.active")?.dataset.category||"all"));
const translations={
rw:{news:"Amakuru",sports:"Siporo",radio:"Radiyo",movies:"Filime",latest:"Amakuru aheruka",scores:"Siporo n'ibitego"},
en:{news:"News",sports:"Sports",radio:"Radio",movies:"Movies",latest:"Latest news",scores:"Sports & scores"},
fr:{news:"Actualités",sports:"Sport",radio:"Radio",movies:"Films",latest:"Dernières nouvelles",scores:"Sports et scores"},
sw:{news:"Habari",sports:"Michezo",radio:"Redio",movies:"Filamu",latest:"Habari za hivi karibuni",scores:"Michezo na matokeo"},
ar:{news:"الأخبار",sports:"الرياضة",radio:"الراديو",movies:"الأفلام",latest:"آخر الأخبار",scores:"الرياضة والنتائج"},
es:{news:"Noticias",sports:"Deportes",radio:"Radio",movies:"Películas",latest:"Últimas noticias",scores:"Deportes y resultados"},
pt:{news:"Notícias",sports:"Desporto",radio:"Rádio",movies:"Filmes",latest:"Últimas notícias",scores:"Desporto e resultados"},
de:{news:"Nachrichten",sports:"Sport",radio:"Radio",movies:"Filme",latest:"Neueste Nachrichten",scores:"Sport & Ergebnisse"},
zh:{news:"新闻",sports:"体育",radio:"广播",movies:"电影",latest:"最新消息",scores:"体育与比分"},
hi:{news:"समाचार",sports:"खेल",radio:"रेडियो",movies:"फ़िल्में",latest:"ताज़ा खबरें",scores:"खेल और स्कोर"},
ja:{news:"ニュース",sports:"スポーツ",radio:"ラジオ",movies:"映画",latest:"最新ニュース",scores:"スポーツとスコア"},
ru:{news:"Новости",sports:"Спорт",radio:"Радио",movies:"Фильмы",latest:"Последние новости",scores:"Спорт и результаты"}
};
$("#language").addEventListener("change",e=>{const t=translations[e.target.value]||translations.rw;document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(t[k])el.textContent=t[k]});document.documentElement.lang=e.target.value;});
$("#year").textContent=new Date().getFullYear();
renderNews();renderRadios();renderMovies();
