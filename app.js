/* Klopost – Post vom Thron 💩📬 */
(() => {
"use strict";
const C = window.KT_CONFIG;
const sb = supabase.createClient(C.supabaseUrl, C.anonKey, { auth: { persistSession: true, autoRefreshToken: true, storageKey: "kt-auth" } });
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const app = $("#app");

// ---------- Daten-Kataloge ----------
// Form: 1–7 Bristol-Klassiker (IDs bleiben stabil!), 8+ Sonderformen
const SHAPES = [null,
  { e: "🐇", n: "Hasenköttel", d: "Einzelne harte Kügelchen", x: "Kommt einzeln, klackert beim Aufprall und braucht ewig. Dein Darm hat heute Wassersparmodus.", ex: ["wie Kaninchenfutter", "wie eine Handvoll Murmeln", "wie Kaffeebohnen aus der Hölle"] },
  { e: "🐛", n: "Raupe Nimmersatt", d: "Klumpig, wurstförmig", x: "Eine Wurst, die aussieht, als hätte jemand Hasenköttel zusammengeklebt. Hart erarbeitet.", ex: ["wie eine Traube aus Rosinen", "wie ein Brombeeren-Strang", "wie Nuss-Nougat-Riegel mit ganzen Nüssen"] },
  { e: "🌭", n: "Bratwurst", d: "Wurst mit Rissen", x: "Solide Leistung mit Charakter-Falten. Fast perfekt – nur leicht ausgetrocknet.", ex: ["wie eine Thüringer vom Grill", "wie ein Maiskolben", "wie ein trockenes Baguette"] },
  { e: "🍌", n: "Lehrbuch-Banane", d: "Glatt & geschmeidig – Perfektion", x: "Glatt, weich, formschön. So steht's im Lehrbuch. Hier gibt's nichts zu meckern – nur zu applaudieren.", ex: ["wie eine Nuss-Nougat-Stange", "wie eine reife Banane", "wie frische Zahnpasta aus der Tube"] },
  { e: "🍗", n: "Chicken Nuggets", d: "Weiche Stückchen", x: "Mehrere weiche Häppchen mit klaren Kanten. Rutscht gut, aber kommt im Rudel.", ex: ["wie Chicken Nuggets", "wie Gnocchi", "wie weiche Pralinen im Sommer"] },
  { e: "🥔", n: "Kartoffelbrei", d: "Breiig & fluffig", x: "Fluffig, ausgefranst, keine klare Form mehr. Der Darm hat's eilig gehabt.", ex: ["wie Kartoffelbrei", "wie Haferbrei", "wie zerdrückte Banane fürs Baby"] },
  { e: "🍫", n: "Schokobrunnen", d: "Flüssig. Viel Glück.", x: "Komplett flüssig, keine festen Stücke. Bleib in Klonähe und trink was!", ex: ["wie ein Schokobrunnen", "wie kalter Kakao", "wie ein Espresso doppio"] },
  { e: "🍦", n: "Softeis-Spirale", d: "Kunstvoll aufgerollt", x: "Wie aus der Softeismaschine: perfekt gekringelt. Ein Fall fürs Museum – oder für Instagram.", ex: ["wie Softeis vom Kirmesstand", "wie ein Schneckenhaus", "wie Zimtschnecke"], s: 1 },
  { e: "🚀", n: "Torpedo", d: "Schnell, kompakt, zielstrebig", x: "Kurz, dick, aerodynamisch – und raus war's, bevor du dich hingesetzt hast. Spritzwasser-Gefahr!", ex: ["wie ein Zeppelin", "wie eine Thermoskanne", "wie ein Rugby-Ei"], s: 1 },
  { e: "☁️", n: "Schäfchenwolke", d: "Leicht & treibt oben", x: "Federleicht, fluffig, schwimmt wie ein Badeentchen. Ballaststoff-Champion!", ex: ["wie ein Marshmallow", "wie Zuckerwatte im Regen", "wie ein Rettungsring"], s: 1 },
  { e: "🧩", n: "Mehrteiler", d: "Fortsetzung folgt …", x: "Teil 1, Teil 2, Teil 3 – eine Serie mit mehreren Staffeln. Du dachtest, du bist fertig? Falsch.", ex: ["wie eine Netflix-Serie", "wie ein Zug mit Waggons", "wie Würstchen am Stück"], s: 1 },
  { e: "❓", n: "Fragezeichen", d: "Elegant gebogen", x: "Ein geschwungener Haken mit Stil. Die Schüssel fragt sich: Was willst du mir sagen?", ex: ["wie ein Spazierstock", "wie ein Fragezeichen", "wie eine Bananen-Kurve"], s: 1 },
  { e: "🐍", n: "Anakonda", d: "Überlänge. Passt kaum rein.", x: "So lang, dass sie sich in der Schüssel einrollen muss. Rekordverdächtig – hast du ein Maßband?", ex: ["wie eine Gartenschlange", "wie ein Meter Fleischwurst", "wie ein Tau auf dem Segelboot"], s: 1 },
  { e: "🥨", n: "Brezel", d: "Verknotet & verschlungen", x: "Hat sich auf dem Weg verknotet. Physik? Kennt dieser Haufen nicht.", ex: ["wie eine Laugenbrezel", "wie ein Seemannsknoten", "wie Kopfhörerkabel in der Hosentasche"], s: 1 },
  { e: "👻", n: "Phantom", d: "Gefühlt viel, gesehen nix", x: "Du hast gespürt, dass was kam – aber in der Schüssel ist … nichts? Ein Geist. Ein Rätsel.", ex: ["wie ein UFO-Sichtungsbericht", "wie ein Furz mit Ambitionen", "wie die Steuererklärung: gefühlt riesig, real winzig"], s: 1 },
];
// Konsistenz: IDs 1–5 bleiben (alte Einträge), h = Härte zum Sortieren (10 = steinhart)
const CONS = [null,
  { e: "🧱", n: "Beton", h: 10, x: "Steinhart. Hier wurde gemeißelt, nicht gekackt.", ex: ["wie Beton", "wie Hartkäse aus dem Kühlschrank", "wie ein Kieselstein"] },
  { e: "🍪", n: "Keks", h: 8.5, x: "Fest und leicht bröselig. Knackt fast beim Brechen.", ex: ["wie ein Butterkeks", "wie trockener Kuchen", "wie Müsliriegel"] },
  { e: "🧈", n: "Butter", h: 6, x: "Butter bei Zimmertemperatur: weich, formbar, aber standfest. Sehr angenehm.", ex: ["wie Butter bei Zimmertemperatur", "wie Frischkäse", "wie weicher Brie"] },
  { e: "🍮", n: "Pudding", h: 3.5, x: "Wackelig und weich. Hält kaum noch eine Form.", ex: ["wie Vanillepudding", "wie Grießbrei", "wie Wackelpudding ohne Gelatine"] },
  { e: "🍜", n: "Suppe", h: 1, x: "Flüssig mit Einlage. Hat mit fester Nahrung nichts mehr zu tun.", ex: ["wie Linsensuppe", "wie Gulaschsuppe", "wie Ramen ohne Nudeln"] },
  { e: "🎨", n: "Knete", h: 7.5, x: "Zäh und formbar – man könnte Figuren daraus kneten (bitte nicht).", ex: ["wie Play-Doh", "wie Modelliermasse", "wie Brotteig nach dem Gehen"] },
  { e: "🥜", n: "Erdnussbutter", h: 5, x: "Cremig, zäh und klebt überall. Das Papier wird dich hassen.", ex: ["wie Erdnussbutter (creamy)", "wie Nutella", "wie Tahini"] },
  { e: "🫘", n: "Hummus", h: 4.5, x: "Streichfähig und leicht körnig. Gut fürs Fladenbrot, schlecht fürs Klo.", ex: ["wie Hummus", "wie Thunfischaufstrich", "wie Kichererbsenpüree"] },
  { e: "🍦", n: "Softeis", h: 4, x: "Cremig-luftig, sackt langsam zusammen. Schmilzt quasi beim Zuschauen.", ex: ["wie Softeis in der Sonne", "wie Sprühsahne", "wie Mousse au Chocolat"] },
  { e: "🌶️", n: "Chili con Carne", h: 2.5, x: "Breiig mit Stücken drin. Der Eintopf unter den Geschäften.", ex: ["wie Chili con Carne", "wie Bolognese", "wie Baked Beans"] },
  { e: "🥤", n: "Smoothie", h: 2, x: "Dickflüssig, aber gießbar. Fruchtig ist hier allerdings nichts.", ex: ["wie ein Bananen-Smoothie", "wie ein Milchshake", "wie Trinkjoghurt"] },
  { e: "🍬", n: "Kaugummi", h: 7, x: "Zäh, elastisch, will nicht loslassen. Abreißen erfordert Willenskraft.", ex: ["wie ausgekautes Kaugummi", "wie Toffee", "wie Karamell aus dem Kühlschrank"] },
];
const CONS_ORDER = CONS.map((c, i) => i).filter((i) => i).sort((a, b) => CONS[b].h - CONS[a].h);
// Zusatzmerkmale (Mehrfachauswahl)
const EXTRAS = {
  sticky: { e: "🩹", n: "Schüssel-Kleber", x: "Klebt an der Keramik fest. Klobürste muss ran." },
  floater: { e: "🛟", n: "Schwimmer", x: "Treibt fröhlich an der Oberfläche. Will einfach nicht gehen." },
  sinker: { e: "⚓", n: "Titanic", x: "Sinkt sofort auf den Grund. Ein Abschied in Würde." },
  splash: { e: "💦", n: "Platscher", x: "Spritzwasser-Alarm! Popo hat was abbekommen." },
  ghost: { e: "✨", n: "Geisterwisch", x: "Papier blieb sauber. Ein seltenes Wunder." },
  endless: { e: "🧻", n: "Endlos-Wischer", x: "Das Papier geht aus, bevor es sauber ist." },
  corn: { e: "🌽", n: "Mais-Comeback", x: "Der Mais von gestern lässt grüßen. Unverdaut, unbesiegt." },
  stink: { e: "☣️", n: "Biowaffe", x: "Geruch der Stufe 5. Fenster auf, Raum für 20 Minuten sperren." },
  loud: { e: "🎺", n: "Blaskapelle", x: "Mit Begleitmusik. Die Nachbarn haben's mitgekriegt." },
  record: { e: "⏱️", n: "Speedrun", x: "Unter 60 Sekunden rein und raus. Weltrekord-verdächtig." },
};
const EXTRA_EXCL = { floater: "sinker", sinker: "floater", ghost: "endless", endless: "ghost" };
const shapeOf = (i) => SHAPES[i] || { e: "💩", n: `Form ${i}`, d: "", x: "", ex: [] };
const consOf = (i) => CONS[i] || { e: "💩", n: `Stufe ${i}`, x: "", ex: [], h: 5 };
const PLACES = { home: { e: "🏠", n: "Daheim" }, work: { e: "💼", n: "Arbeit" }, bar: { e: "🍻", n: "Kneipe" }, road: { e: "🚂", n: "Unterwegs" }, nature: { e: "🌲", n: "Natur" }, friends: { e: "👀", n: "Bei Freunden" } };
const REACTS = ["💩", "🔥", "👏", "😂", "🤢", "🏆"];
const AVATARS = ["💩","🦄","🐻","🐸","🦊","🐷","🐵","🐼","🦖","👽","🤖","🤡","👑","🐙","🦆","🐔","🧻","🚽","🍑","🌶️","😎","🥸","🧙","🐌"];
const AVA_BG = ["#4CC9F0","#FFD23F","#3DDC97","#FF5D8F","#FF8A3D","#9B5DE5","#B8F2E6","#FFB5C2"];
const avaBg = (id) => AVA_BG[[...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0) % AVA_BG.length];
const pressInfo = (p) => p < 15 ? { e: "😌", n: "Federleicht – rausgeflutscht 🪶" } : p < 40 ? { e: "🙂", n: "Entspannt, kleines Schnaufen" } : p < 65 ? { e: "😤", n: "Ordentlich gedrückt" } : p < 85 ? { e: "🍅", n: "Tomatenkopf!" } : { e: "🤰", n: "Presswehen. Respekt." };
const COMMENT_PH = ["Letzte Worte?", "Wie war's? Sei ehrlich …", "Grüße an die Kanalisation", "Was hast du gestern gegessen?!", "Eine Botschaft an die Nachwelt …"];

const LEGAL_BASE = "https://klopost.github.io/";
const LEGAL = [["datenschutz.html", "🔒 Datenschutz"], ["nutzungsbedingungen.html", "📜 Nutzungsbedingungen"], ["impressum.html", "🏛️ Impressum"], ["support.html", "🛟 Hilfe & Kontakt"]];
const legalLinks = (cls = "legal-links") => `<nav class="${cls}">${LEGAL.map(([h, t]) => `<a href="${LEGAL_BASE}${h}" target="_blank" rel="noopener">${t}</a>`).join("")}</nav>`;
const CONSENT_HTML = `
  <label class="cbx"><input type="checkbox" name="c_age" required><span>Ich bin <b>mindestens 16 Jahre</b> alt. 🔞</span></label>
  <label class="cbx"><input type="checkbox" name="c_terms" required><span>Ich akzeptiere die <a href="${LEGAL_BASE}nutzungsbedingungen.html" target="_blank" rel="noopener">Nutzungsbedingungen &amp; Community-Regeln</a> und habe die <a href="${LEGAL_BASE}datenschutz.html" target="_blank" rel="noopener">Datenschutzerklärung</a> gelesen.</span></label>
  <label class="cbx"><input type="checkbox" name="c_health" required><span>Ich willige <b>ausdrücklich</b> ein, dass Klopost meine Klo-Einträge (das sind <b>Gesundheitsdaten</b>, Art. 9 DSGVO) speichert und meinen Freunden zeigt. Widerruf jederzeit: Einträge oder Konto löschen.</span></label>`;
const readConsent = (root) => ({ age: !!root.querySelector('[name="c_age"]')?.checked, terms: !!root.querySelector('[name="c_terms"]')?.checked, health: !!root.querySelector('[name="c_health"]')?.checked });
function openSheet(html, cls = "") {
  const bd = document.createElement("div"); bd.className = "backdrop";
  const sh = document.createElement("div"); sh.className = "sheet " + cls; sh.innerHTML = `<div class="grab"></div>${html}`;
  document.body.append(bd, sh);
  const close = () => { bd.remove(); sh.remove(); }; bd.onclick = close;
  sh.querySelectorAll("[data-close]").forEach((b) => b.onclick = close);
  return { sh, close };
}

// ---------- Zustand ----------
const S = { session: null, me: null, profiles: {}, friends: [], blocked: new Set(), reqIn: [], reqOut: [], q: "", results: null, seenReq: null, logs: [], reacts: [], tab: "feed", period: "week", draft: null, pollT: null, seenLog: 0, sound: localStorage.getItem("kt-sound") !== "off" };
const pendingInvite = () => localStorage.getItem("kt-invite");
{ const u = new URL(location.href); const inv = u.searchParams.get("invite"); if (inv) { localStorage.setItem("kt-invite", inv.toUpperCase()); u.searchParams.delete("invite"); history.replaceState(null, "", u.pathname + u.search + u.hash); } }

// ---------- Helfer ----------
async function fn(action, body = {}) {
  const { data: { session } } = await sb.auth.getSession();
  const r = await fetch(`${C.supabaseUrl}/functions/v1/${C.functionName}`, {
    method: "POST",
    headers: { "content-type": "application/json", apikey: C.anonKey, authorization: `Bearer ${session?.access_token ?? C.anonKey}` },
    body: JSON.stringify({ action, ...body }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Fehler ${r.status}`);
  return j;
}
function toast(msg, ms = 3200) {
  const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
  $("#toasts").appendChild(t); setTimeout(() => t.remove(), ms);
}
function rel(ts) {
  const d = new Date(ts), s = (Date.now() - d) / 1000;
  if (s < 45) return "gerade eben";
  if (s < 3600) return `vor ${Math.round(s / 60)} Min.`;
  if (s < 6 * 3600) return `vor ${Math.round(s / 3600)} Std.`;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const hm = d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  if (d >= today) return `heute, ${hm}`;
  if (d >= today - 864e5) return `gestern, ${hm}`;
  return d.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" }) + `, ${hm}`;
}
const dayKey = (ts) => { const d = new Date(ts); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
function streak(logs) {
  const days = new Set(logs.map((l) => dayKey(l.created_at)));
  const d = new Date(); let n = 0;
  if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function maxStreak(logs) {
  const days = [...new Set(logs.map((l) => { const d = new Date(l.created_at); d.setHours(0,0,0,0); return +d; }))].sort();
  let best = 0, cur = 0, prev = 0;
  for (const t of days) { cur = prev && Math.round((t - prev) / 864e5) === 1 ? cur + 1 : 1; best = Math.max(best, cur); prev = t; }
  return best;
}
const avaHTML = (p, cls = "") => `<div class="ava ${cls}" style="background:${avaBg(p?.id)}">${esc(p?.emoji ?? "💩")}</div>`;
const myLogs = () => S.logs.filter((l) => l.user_id === S.me?.id);

// ---------- Sound & Effekte ----------
let actx;
function flushSound() {
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime, len = 2.2;
    const buf = actx.createBuffer(1, actx.sampleRate * len, actx.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    const src = actx.createBufferSource(); src.buffer = buf;
    const bp = actx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(1800, t); bp.frequency.exponentialRampToValueAtTime(260, t + len);
    const g = actx.createGain(); g.gain.setValueAtTime(0.001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.25); g.gain.exponentialRampToValueAtTime(0.001, t + len);
    src.connect(bp).connect(g).connect(actx.destination); src.start(t);
    const o = actx.createOscillator(), og = actx.createGain(); o.type = "sine";
    o.frequency.setValueAtTime(420, t); o.frequency.exponentialRampToValueAtTime(70, t + 0.18);
    og.gain.setValueAtTime(0.5, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(og).connect(actx.destination); o.start(t); o.stop(t + 0.22);
  } catch {}
}
function rain(emojis = ["💩", "🧻", "🚽", "✨", "💨"], n = 46) {
  const fx = $("#fx");
  for (let i = 0; i < n; i++) {
    const d = document.createElement("div"); d.className = "drop";
    d.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    d.style.left = Math.random() * 100 + "vw"; d.style.fontSize = 22 + Math.random() * 30 + "px";
    d.style.animationDuration = 1.6 + Math.random() * 1.8 + "s"; d.style.animationDelay = Math.random() * 0.6 + "s";
    d.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
    fx.appendChild(d); setTimeout(() => d.remove(), 4200);
  }
}
function flushFX() {
  const f = document.createElement("div"); f.className = "flush"; f.innerHTML = `<div class="swirl">🌀</div>`;
  document.body.appendChild(f); setTimeout(() => f.remove(), 1700);
  if (navigator.vibrate) navigator.vibrate([40, 60, 40, 60, 200]);
}

// ---------- Achievements ----------
function badges(logs, friendsCount) {
  const hours = logs.map((l) => new Date(l.created_at).getHours());
  const perDay = {}; logs.forEach((l) => { const k = dayKey(l.created_at); perDay[k] = (perDay[k] || 0) + 1; });
  const maxDay = Math.max(0, ...Object.values(perDay));
  const places = new Set(logs.map((l) => l.place).filter(Boolean));
  const ms = maxStreak(logs);
  const cnt = (f) => logs.filter(f).length;
  const B = (id, e, n, d, cur, goal) => ({ id, e, n, d, cur: Math.min(cur, goal), goal, done: cur >= goal });
  return [
    B("first", "🐣", "Jungfernfahrt", "Erster Eintrag", logs.length, 1),
    B("ten", "🪑", "Stammgast", "10 Einträge", logs.length, 10),
    B("fifty", "👑", "Thronfolger", "50 Einträge", logs.length, 50),
    B("hundred", "🏛️", "Porzellan-Legende", "100 Einträge", logs.length, 100),
    B("hattrick", "⚽", "Hattrick", "3× an einem Tag", maxDay, 3),
    B("streak3", "⏰", "Wie ein Uhrwerk", "3 Tage in Folge", ms, 3),
    B("streak7", "🦾", "Eiserne Verdauung", "7 Tage in Folge", ms, 7),
    B("early", "🌅", "Frühaufsteher", "Vor 7 Uhr geliefert", cnt((l) => { const h = new Date(l.created_at).getHours(); return h >= 4 && h < 7; }), 1),
    B("night", "🦉", "Nachtschicht", "Zwischen 0 und 4 Uhr", hours.filter((h) => h < 4).length, 1),
    B("flush5", "🔧", "Klempners Albtraum", "5+ Spülungen", cnt((l) => l.flushes >= 5), 1),
    B("noflush", "🤢", "Umwelt-Held?", "0× gespült …", cnt((l) => l.flushes === 0), 1),
    B("press", "🤰", "Presswehen", "Druck ≥ 90", cnt((l) => l.pressure >= 90), 1),
    B("feather", "🪶", "Gleitflug", "Druck ≤ 5", cnt((l) => l.pressure != null && l.pressure <= 5), 1),
    B("banana", "🍌", "Bananenrepublik", "5× Lehrbuch-Banane", cnt((l) => l.shape === 4), 5),
    B("choco", "🍫", "Schoko-Schock", "Schokobrunnen überlebt", cnt((l) => l.shape === 7), 1),
    B("artist", "🎨", "Kack-Künstler", "Eine Sonderform geliefert", cnt((l) => SHAPES[l.shape]?.s), 1),
    B("swirl", "🍦", "Softeis-Konditor", "Die perfekte Spirale", cnt((l) => l.shape === 8), 1),
    B("anaconda", "🐍", "Anakonda-Bändiger", "Überlänge abgeliefert", cnt((l) => l.shape === 13), 1),
    B("collector", "📚", "Formen-Sammler", "8 verschiedene Formen", new Set(logs.map((l) => l.shape).filter(Boolean)).size, 8),
    B("chef", "👨‍🍳", "Sternekoch", "6 verschiedene Konsistenzen", new Set(logs.map((l) => l.consistency).filter(Boolean)).size, 6),
    B("floater", "🛟", "Bademeister", "3× Schwimmer", cnt((l) => l.extras?.includes("floater")), 3),
    B("sticky", "🩹", "Klobürsten-Kunde", "Schüssel-Kleber erlebt", cnt((l) => l.extras?.includes("sticky")), 1),
    B("ghost", "✨", "Geisterwisch", "Sauberes Papier – ein Wunder", cnt((l) => l.extras?.includes("ghost")), 1),
    B("bio", "☣️", "Chemiewaffe", "3× Biowaffe gezündet", cnt((l) => l.extras?.includes("stink")), 3),
    B("work", "💼", "Bezahlt kacken", "Auf der Arbeit", cnt((l) => l.place === "work"), 1),
    B("travel", "🧭", "Weltenbummler", "4 verschiedene Orte", places.size, 4),
    B("poet", "✍️", "Klo-Poet", "5 Kommentare", cnt((l) => l.comment), 5),
    B("gold", "⭐", "Jahrhundert-Schiss", "5/5 Bewertung", cnt((l) => l.rating === 5), 1),
    B("weekend", "🎉", "Sonntagsschiss", "An einem Sonntag", cnt((l) => new Date(l.created_at).getDay() === 0), 1),
    B("friend1", "🤝", "Klo-Kumpel", "1 Freund", friendsCount, 1),
    B("friend5", "👯", "Klo-Clique", "5 Freunde", friendsCount, 5),
  ];
}

// ---------- Auth-Screen ----------
async function renderAuth(mode = "register") {
  stopPoll();
  let inviter = null;
  if (pendingInvite()) { try { inviter = await fn("invite_info", { code: pendingInvite() }); } catch { localStorage.removeItem("kt-invite"); } }
  let ava = AVATARS[Math.floor(Math.random() * AVATARS.length)];
  app.innerHTML = `
  <div class="auth">
    <div class="logo"><img class="applogo" src="icons/logo.svg" alt="Klopost-Logo" width="104" height="104"><h1 class="fred">Klo<span>post</span></h1></div>
    <p class="tagline">Post vom Thron 📬 Du warst scheißen?<br><b>Alle deine Freunde kriegen Post. Sofort.</b> 📣</p>
    ${inviter ? `<div class="invite-banner"><div class="big">${esc(inviter.emoji)}</div><div><b>${esc(inviter.display_name)}</b> lädt dich in den Klo-Kreis ein!<div class="muted" style="font-size:14px">Registrier dich oder melde dich an – ihr seid sofort befreundet.</div></div></div>` : ""}
    <div class="tabs"><button data-m="register" class="${mode === "register" ? "on" : ""}">Neu hier</button><button data-m="login" class="${mode === "login" ? "on" : ""}">Anmelden</button></div>
    <form id="authf" class="card" autocomplete="on">
      <label class="f">Benutzername</label>
      <input class="inp" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="z. B. thronkoenig" required minlength="3" maxlength="20">
      ${mode === "register" ? `
      <label class="f">Anzeigename (sehen deine Freunde)</label>
      <input class="inp" name="display" maxlength="24" placeholder="z. B. Sascha">
      <label class="f">Dein Avatar</label>
      <div class="emoji-grid">${AVATARS.map((a) => `<button type="button" data-a="${a}" class="${a === ava ? "on" : ""}">${a}</button>`).join("")}</div>` : ""}
      <label class="f">Passwort</label>
      <input class="inp" name="password" type="password" autocomplete="${mode === "register" ? "new-password" : "current-password"}" placeholder="mind. 6 Zeichen" required minlength="6">
      ${mode === "register" ? `<div class="consents">${CONSENT_HTML}</div>` : ""}
      <div class="err" id="aerr"></div>
      <button class="btn pink block" type="submit">${mode === "register" ? "Konto anlegen 🚀" : "Rein da! 🚪"}</button>
    </form>
    <p class="fineprint muted">Keine E-Mail nötig. Nur Benutzername & Passwort. Keine Werbung, keine Tracker. 🚫📈<br>Kein Arzt, keine Diagnose – nur <b>Klatsch &amp; Tratsch</b>. 😂 Ab 16.</p>
    ${legalLinks()}
  </div>`;
  app.querySelectorAll(".tabs button").forEach((b) => b.onclick = () => renderAuth(b.dataset.m));
  app.querySelectorAll(".emoji-grid button").forEach((b) => b.onclick = () => { ava = b.dataset.a; app.querySelectorAll(".emoji-grid button").forEach((x) => x.classList.toggle("on", x === b)); });
  $("#authf").onsubmit = async (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target), btn = ev.target.querySelector("button[type=submit]");
    const username = String(f.get("username")).trim().toLowerCase(), password = String(f.get("password"));
    $("#aerr").textContent = ""; btn.disabled = true;
    try {
      if (mode === "register") {
        const consent = readConsent(ev.target);
        if (!consent.age) throw new Error("Klopost ist erst ab 16 Jahren 🔞");
        if (!consent.terms || !consent.health) throw new Error("Bitte die Häkchen zu Nutzungsbedingungen, Datenschutz und Klo-Daten setzen 📜");
        await fn("signup", { username, password, display_name: String(f.get("display") || "").trim() || username, emoji: ava, consent });
      }
      const { error } = await sb.auth.signInWithPassword({ email: `${username}@${C.emailDomain}`, password });
      if (error) throw new Error(/invalid/i.test(error.message) ? "Benutzername oder Passwort falsch 🙈" : error.message);
      await start();
    } catch (e) { $("#aerr").textContent = e.message; btn.disabled = false; }
  };
}

// ---------- Laden ----------
async function load() {
  const uid = S.session.user.id;
  const [{ data: profs }, { data: fr }, { data: logs }] = await Promise.all([
    sb.from("kt_profiles").select("*"),
    sb.from("kt_friendships").select("friend_id,created_at").eq("user_id", uid),
    sb.from("kt_logs").select("*").order("created_at", { ascending: false }).limit(1500),
    sb.from("kt_blocks").select("blocked_id"),
  ]).then((r) => { S.blocked = new Set((r[3].data ?? []).map((b) => b.blocked_id)); return r; });
  S.profiles = Object.fromEntries((profs ?? []).map((p) => [p.id, p]));
  S.me = S.profiles[uid];
  S.friends = (fr ?? []).map((f) => S.profiles[f.friend_id]).filter(Boolean);
  S.logs = logs ?? [];
  try { const r = await fn("requests"); S.reqIn = r.incoming ?? []; S.reqOut = r.outgoing ?? []; } catch { /* egal */ }
  const ids = S.logs.slice(0, 120).map((l) => l.id);
  S.reacts = (ids.length ? ((await sb.from("kt_reactions").select("*").in("log_id", ids)).data ?? []) : []).filter((r) => !S.blocked.has(r.user_id));
}

async function start() {
  const { data: { session } } = await sb.auth.getSession();
  S.session = session;
  if (!session) return renderAuth(pendingInvite() ? "register" : "login");
  await load();
  if (!S.me) { await sb.auth.signOut(); return renderAuth("login"); }
  if (S.me.banned_at) return renderBanned();
  if (!S.me.consent_at) return renderConsentGate();
  if (pendingInvite()) {
    const code = pendingInvite(); localStorage.removeItem("kt-invite");
    try {
      const r = await fn("accept_invite", { code });
      if (r.self) toast("Das ist dein eigener Einladungslink 😄 Schick ihn an Freunde!");
      else { toast(`🤝 Du und ${r.friend.emoji} ${r.friend.display_name} seid jetzt Klo-Kumpels!`, 4500); rain(["🤝", "💩", "🎉"], 30); await load(); }
    } catch (e) { toast(e.message); }
  }
  const h = location.hash;
  S.tab = h === "#friends" ? "me" : "feed";
  S.seenLog = S.logs[0]?.id ?? 0; S.seenReq = S.reqIn.map((r) => r.id);
  renderShell();
  registerSW();
  startPoll();
  if (h.startsWith("#log-")) setTimeout(() => focusLog(h.slice(5)), 300);
}

// ---------- Hauptlayout ----------
function renderShell() {
  app.innerHTML = `
  <header class="top"><img class="hlogo" src="icons/mark.svg" alt="" width="38" height="38"><h1 class="fred">Klo<span>post</span></h1><div class="spacer"></div>
    <button class="bell" id="bell" title="Push-Benachrichtigungen">🔔</button></header>
  <main class="view" id="view"></main>
  <nav class="nav">
    <button data-t="feed"><span>📰</span>Feed</button>
    <button data-t="rank"><span>🏆</span>Rangliste</button>
    <button class="fab" id="fab" aria-label="Ich war scheißen">💩</button>
    <button data-t="badges"><span>🎖️</span>Erfolge</button>
    <button data-t="me" id="navme"><span>${esc(S.me.emoji)}</span>Freunde<i class="nbadge" id="nbadge" hidden></i></button>
  </nav>`;
  app.querySelectorAll(".nav [data-t]").forEach((b) => b.onclick = () => { S.tab = b.dataset.t; renderView(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  $("#fab").onclick = () => openLogSheet();
  $("#bell").onclick = () => { S.tab = "me"; renderView(); setTimeout(() => $("#pushcard")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50); };
  renderView(); updateBell();
}
function updateReqBadge() {
  const b = $("#nbadge"); if (!b) return;
  b.hidden = !S.reqIn.length; b.textContent = S.reqIn.length > 9 ? "9+" : S.reqIn.length;
}
function renderView() {
  updateReqBadge();
  app.querySelectorAll(".nav [data-t]").forEach((b) => b.classList.toggle("on", b.dataset.t === S.tab));
  const v = $("#view"); if (!v) return;
  ({ feed: viewFeed, rank: viewRank, badges: viewBadges, me: viewMe })[S.tab](v);
}

// ---------- Feed ----------
function viewFeed(v) {
  const mine = myLogs(), last = mine[0], st = streak(mine);
  const today = mine.filter((l) => dayKey(l.created_at) === dayKey(Date.now())).length;
  const status = !last ? "Du hast noch nie gemeldet. Zeit für dein Debüt! 🎬"
    : (Date.now() - new Date(last.created_at)) < 36e5 ? `Letzter Besuch ${rel(last.created_at)} – frisch erleichtert ✨`
    : `Letzter Besuch ${rel(last.created_at)}`;
  v.innerHTML = `
  <section class="card hero">
    <div class="status muted">${esc(status)}</div>
    <h2>${today ? "Nochmal? Respekt. 😳" : "Schon geliefert heute?"}</h2>
    <button class="bigbtn" id="big"><span class="p">💩</span><span class="t">Ich war scheißen!</span></button>
    <div class="hero-stats">
      <span class="pill">🔥 ${st} ${st === 1 ? "Tag" : "Tage"} Streak</span>
      <span class="pill">📅 heute ${today}×</span>
      <span class="pill">🧻 gesamt ${mine.length}</span>
    </div>
    <div class="quick"><a href="#" class="link" id="quick">⚡ Schnellmeldung ohne Details</a></div>
  </section>
  <div class="section-title"><h3>📬 Thron-Post</h3><span class="muted" style="font-size:13px">${S.friends.length} ${S.friends.length === 1 ? "Freund" : "Freunde"} schauen zu</span></div>
  <div id="feed"></div>`;
  $("#big").onclick = () => openLogSheet();
  $("#quick").onclick = (e) => { e.preventDefault(); submitLog({}); };
  const feed = $("#feed");
  if (!S.friends.length) feed.insertAdjacentHTML("beforeend", `<div class="card empty" style="margin-bottom:14px;background:var(--mint)"><div class="big">🦗</div><h3>Ganz schön einsam hier …</h3><p class="muted">Lade Freunde ein, damit sie mitbekommen, wann du auf dem Thron warst!</p><button class="btn white" id="inv0">📨 Freunde einladen</button></div>`);
  if (!S.logs.length) feed.insertAdjacentHTML("beforeend", `<div class="card empty"><div class="big">🚽</div><p class="muted">Noch keine Meldungen. Sei der/die Erste!</p></div>`);
  feed.insertAdjacentHTML("beforeend", S.logs.slice(0, 80).map(postHTML).join(""));
  $("#inv0") && ($("#inv0").onclick = shareInvite);
  bindPosts(feed);
}
function postHTML(l) {
  const p = S.profiles[l.user_id] || { emoji: "👻", display_name: "Unbekannt" };
  const isMe = l.user_id === S.me.id;
  const chips = [];
  if (l.shape) { const f = shapeOf(l.shape); chips.push(`<button class="chip tip" data-tip="${esc(`${f.e} ${f.n}: ${f.x}${f.ex?.length ? ` – ${f.ex[0]}` : ""}`)}">${f.e} ${f.n}</button>`); }
  if (l.consistency) { const c = consOf(l.consistency); chips.push(`<button class="chip tip" data-tip="${esc(`${c.e} ${c.n}: ${c.x}${c.ex?.length ? ` – ${c.ex[0]}` : ""}`)}">${c.e} ${c.n}</button>`); }
  (l.extras || []).forEach((k) => { const x = EXTRAS[k]; if (x) chips.push(`<button class="chip tip xtra" data-tip="${esc(`${x.e} ${x.n}: ${x.x}`)}">${x.e} ${x.n}</button>`); });
  if (l.flushes != null) chips.push(`<span class="chip">🚽 ${l.flushes}× gespült</span>`);
  if (l.place && PLACES[l.place]) chips.push(`<span class="chip">${PLACES[l.place].e} ${PLACES[l.place].n}</span>`);
  if (l.rating) chips.push(`<span class="chip">${"💩".repeat(l.rating)}<span style="opacity:.25">${"💩".repeat(5 - l.rating)}</span></span>`);
  const rs = S.reacts.filter((r) => r.log_id === l.id);
  const reacts = REACTS.map((e) => {
    const n = rs.filter((r) => r.emoji === e).length, on = rs.some((r) => r.emoji === e && r.user_id === S.me.id);
    const who = rs.filter((r) => r.emoji === e).map((r) => S.profiles[r.user_id]?.display_name).filter(Boolean).join(", ");
    return `<button data-r="${e}" data-l="${l.id}" class="${on ? "on" : ""}" title="${esc(who)}">${e}${n ? `<b>${n}</b>` : ""}</button>`;
  }).join("");
  return `<article class="card post" id="log-${l.id}">
    <div class="who">${avaHTML(p)}<div><div class="name">${esc(p.display_name)}${isMe ? " <span class='muted' style='font-size:13px'>(du)</span>" : ""}</div><div class="time">🕒 ${rel(l.created_at)}</div></div>
      ${isMe ? `<button class="del" data-del="${l.id}" title="Löschen">🗑️</button>` : `<button class="del more" data-pmenu="${l.id}" title="Melden / Blockieren" aria-label="Melden oder blockieren">⋯</button>`}</div>
    <div class="headline">${esc(l.headline || `${p.display_name} war scheißen 💩`)}</div>
    ${chips.length ? `<div class="chips">${chips.join("")}</div>` : ""}
    ${l.pressure != null ? `<div class="pbar"><i style="width:${Math.max(4, l.pressure)}%"></i></div><div class="plabel">Druck beim Abgang: ${pressInfo(l.pressure).e} ${pressInfo(l.pressure).n} (${l.pressure}%)</div>` : ""}
    ${l.comment ? `<div class="comment">„${esc(l.comment)}“</div>` : ""}
    <div class="reacts">${reacts}</div>
  </article>`;
}
function bindPosts(root) {
  root.querySelectorAll("[data-pmenu]").forEach((b) => b.onclick = () => postMenu(+b.dataset.pmenu));
  root.querySelectorAll("[data-tip]").forEach((b) => b.onclick = () => toast(b.dataset.tip, 4500));
  root.querySelectorAll("[data-r]").forEach((b) => b.onclick = async () => {
    const logId = +b.dataset.l, emoji = b.dataset.r;
    const ix = S.reacts.findIndex((r) => r.log_id === logId && r.emoji === emoji && r.user_id === S.me.id);
    if (ix >= 0) S.reacts.splice(ix, 1); else S.reacts.push({ log_id: logId, emoji, user_id: S.me.id });
    rerenderPost(logId);
    if (ix < 0) { const r = b.getBoundingClientRect(); burst(emoji, r.left + r.width / 2, r.top); }
    try { await fn("react", { log_id: logId, emoji }); } catch (e) { toast(e.message); }
  });
  root.querySelectorAll("[data-del]").forEach((b) => b.onclick = async () => {
    if (!confirm("Diesen Eintrag wirklich runterspülen? 🚽")) return;
    await fn("delete_log", { log_id: +b.dataset.del }).catch((e) => toast(e.message));
    S.logs = S.logs.filter((l) => l.id !== +b.dataset.del); renderView();
  });
}
function rerenderPost(id) {
  const el = $(`#log-${id}`), l = S.logs.find((x) => x.id === id);
  if (!el || !l) return;
  el.outerHTML = postHTML(l); const n = $(`#log-${id}`); n.style.animation = "none"; bindPosts(n);
}
function burst(e, x, y) {
  for (let i = 0; i < 8; i++) {
    const d = document.createElement("div"); d.textContent = e;
    d.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:22px;transition:all .7s cubic-bezier(.2,.8,.4,1);z-index:99;pointer-events:none`;
    document.body.appendChild(d);
    requestAnimationFrame(() => { const a = Math.random() * Math.PI * 2, r = 40 + Math.random() * 50; d.style.transform = `translate(${Math.cos(a) * r}px,${Math.sin(a) * r - 30}px) scale(.6)`; d.style.opacity = "0"; });
    setTimeout(() => d.remove(), 800);
  }
}
function focusLog(id) {
  S.tab = "feed"; renderView();
  const el = $(`#log-${id}`); if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" }); el.classList.add("hl"); setTimeout(() => el.classList.remove("hl"), 2500);
}

// ---------- Eintrag-Sheet ----------
const shapeCard = (s, i) => `<button class="shape${s.s ? " special" : ""}" data-shape="${i}"><span class="e">${s.e}</span><b>${s.n}</b><small>${s.d}</small><span class="n">${s.s ? "Spezial" : `Typ ${i}`}</span></button>`;
const exHTML = (ex) => ex?.length ? `<div class="ex">Sieht aus ${ex.map((x) => `<i>„${esc(x)}“</i>`).join(" · ")}</div>` : "";
const hardHTML = (h) => `<span class="hard" title="Härte ${h}/10"><i style="width:${h * 10}%"></i></span>`;
const explainHTML = (o, tag) => `<div class="xh"><span class="xe">${o.e}</span><b>${esc(o.n)}</b><span class="tag">${tag}</span></div><div>${esc(o.x)}</div>${exHTML(o.ex)}`;
function openLegend(kind, onPick) {
  const items = kind === "shape" ? SHAPES.map((s, i) => [s, i]).filter(([s]) => s) : CONS_ORDER.map((i) => [CONS[i], i]);
  const bd = document.createElement("div"); bd.className = "backdrop"; bd.style.zIndex = 60;
  const m = document.createElement("div"); m.className = "card legend";
  m.innerHTML = `<div class="lg-head"><h3>${kind === "shape" ? "💩 Formen-Lexikon" : "🧪 Konsistenz-Skala"}</h3><button class="x" aria-label="Schließen">✕</button></div>
    <p class="muted" style="margin:0 0 8px;font-size:14px">${kind === "shape" ? "Typ 1–7 nach der Bristol-Stuhlformen-Skala (1 = hart, 4 = ideal, 7 = flüssig) – plus unsere Sonderformen." : "Von steinhart bis flüssig. Tippe zum Auswählen."}</p>
    <div class="lg-list">${items.map(([o, i]) => `<button class="lg-item" data-pick="${i}"><span class="xe">${o.e}</span><div><div class="xh"><b>${esc(o.n)}</b><span class="tag">${kind === "shape" ? (o.s ? "Spezial" : `Typ ${i}`) : hardHTML(o.h)}</span></div><div class="lg-d">${esc(o.x)}</div>${exHTML(o.ex)}</div></button>`).join("")}</div>`;
  document.body.append(bd, m);
  const close = () => { bd.remove(); m.remove(); };
  bd.onclick = close; $(".x", m).onclick = close;
  m.querySelectorAll("[data-pick]").forEach((b) => b.onclick = () => { onPick(+b.dataset.pick); close(); });
}
function openLogSheet() {
  const d = S.draft = { shape: null, consistency: null, extras: [], pressure: 35, pressureSet: false, flushes: 1, flushSet: false, place: null, rating: null, comment: "" };
  const bd = document.createElement("div"); bd.className = "backdrop";
  const sh = document.createElement("div"); sh.className = "sheet";
  sh.innerHTML = `<div class="grab"></div>
    <h2>Bericht vom Thron 👑</h2>
    <p class="sub muted">Alles optional. Aber deine Freunde wollen Details. 😏</p>
    <div class="q"><h4>Form <button type="button" class="info-btn" data-legend="shape">ℹ️ Alle Formen erklärt</button></h4>
      <div class="grp-l">Bristol-Klassiker <small>Typ 1 = hart · Typ 7 = flüssig</small></div>
      <div class="shapes">${SHAPES.map((s, i) => s && !s.s ? shapeCard(s, i) : "").join("")}</div>
      <div class="grp-l">Sonderformen ✨ <small>für besondere Momente</small></div>
      <div class="shapes">${SHAPES.map((s, i) => s && s.s ? shapeCard(s, i) : "").join("")}</div>
      <div class="explain" id="shape-x"><span class="muted">👆 Tippe eine Form an – hier erfährst du, was sie über dich verrät.</span></div></div>
    <div class="q"><h4>Konsistenz <button type="button" class="info-btn" data-legend="cons">ℹ️ Legende</button></h4>
      <div class="cons-scale"><span>🧱 steinhart</span><span>flüssig 🌊</span></div>
      <div class="opts cons">${CONS_ORDER.map((i) => `<button class="opt" data-cons="${i}">${CONS[i].e} ${CONS[i].n}</button>`).join("")}</div>
      <div class="explain" id="cons-x"><span class="muted">👆 Wähle eine Konsistenz – mit Vergleich aus der Küche.</span></div></div>
    <div class="q"><h4>Besondere Vorkommnisse <small>Mehrfachauswahl</small></h4>
      <div class="opts">${Object.entries(EXTRAS).map(([k, x]) => `<button class="opt" data-extra="${k}">${x.e} ${x.n}</button>`).join("")}</div>
      <div class="explain" id="extra-x"><span class="muted">Schwimmer, Kleber, Biowaffe? Erzähl alles. 🕵️</span></div></div>
    <div class="q"><h4>Nötiger Druck beim Abgang <small id="pval">nicht angegeben</small></h4>
      <div class="press"><div class="face" id="pface">😌</div><div class="lbl" id="plbl">Schieb den Regler 👇</div><input type="range" min="0" max="100" value="35" id="prange"></div></div>
    <div class="q"><h4>Spülungen</h4>
      <div class="stepper"><button id="fm">−</button><div class="num" id="fnum">1</div><button id="fp">+</button><div class="toilets" id="ftxt"></div></div></div>
    <div class="q"><h4>Wo?</h4><div class="opts">${Object.entries(PLACES).map(([k, p]) => `<button class="opt" data-place="${k}">${p.e} ${p.n}</button>`).join("")}</div></div>
    <div class="q"><h4>Gesamtbewertung</h4><div class="stars">${[1, 2, 3, 4, 5].map((n) => `<button data-star="${n}">💩</button>`).join("")}</div></div>
    <div class="q"><h4>Kommentar <small>max. 200 Zeichen</small></h4><input class="inp" id="cmt" maxlength="200" placeholder="${COMMENT_PH[Math.floor(Math.random() * COMMENT_PH.length)]}"></div>
    <div class="sheet-actions"><button class="btn pink block" id="send">📣 Abschicken & alle informieren</button>
      <div style="text-align:center;margin-top:10px"><a href="#" class="link" id="cancel">Abbrechen</a></div></div>`;
  document.body.append(bd, sh);
  const close = () => { bd.remove(); sh.remove(); };
  bd.onclick = close; $("#cancel", sh).onclick = (e) => { e.preventDefault(); close(); };
  const single = (sel, key, attr) => sh.querySelectorAll(sel).forEach((b) => b.onclick = () => {
    const val = b.dataset[attr]; const v = isNaN(+val) ? val : +val;
    d[key] = d[key] === v ? null : v;
    sh.querySelectorAll(sel).forEach((x) => x.classList.toggle("on", String(d[key]) === x.dataset[attr]));
    if (navigator.vibrate) navigator.vibrate(10);
  });
  single("[data-shape]", "shape", "shape"); single("[data-cons]", "consistency", "cons"); single("[data-place]", "place", "place");
  const showShape = () => { $("#shape-x", sh).innerHTML = d.shape ? explainHTML(SHAPES[d.shape], SHAPES[d.shape].s ? "Sonderform" : `Bristol-Typ ${d.shape}`) : `<span class="muted">👆 Tippe eine Form an – hier erfährst du, was sie über dich verrät.</span>`; };
  const showCons = () => { $("#cons-x", sh).innerHTML = d.consistency ? explainHTML(CONS[d.consistency], hardHTML(CONS[d.consistency].h)) : `<span class="muted">👆 Wähle eine Konsistenz – mit Vergleich aus der Küche.</span>`; };
  const showExtras = () => {
    sh.querySelectorAll("[data-extra]").forEach((x) => x.classList.toggle("on", d.extras.includes(x.dataset.extra)));
    $("#extra-x", sh).innerHTML = d.extras.length ? d.extras.map((k) => `<div><b>${EXTRAS[k].e} ${EXTRAS[k].n}:</b> ${EXTRAS[k].x}</div>`).join("") : `<span class="muted">Schwimmer, Kleber, Biowaffe? Erzähl alles. 🕵️</span>`;
  };
  sh.querySelectorAll("[data-shape]").forEach((b) => b.addEventListener("click", showShape));
  sh.querySelectorAll("[data-cons]").forEach((b) => b.addEventListener("click", showCons));
  sh.querySelectorAll("[data-extra]").forEach((b) => b.onclick = () => {
    const k = b.dataset.extra;
    if (d.extras.includes(k)) d.extras = d.extras.filter((x) => x !== k);
    else { d.extras = d.extras.filter((x) => x !== EXTRA_EXCL[k]); d.extras.push(k); }
    showExtras(); if (navigator.vibrate) navigator.vibrate(10);
  });
  sh.querySelectorAll("[data-legend]").forEach((b) => b.onclick = () => openLegend(b.dataset.legend, (i) => {
    const key = b.dataset.legend === "shape" ? "shape" : "consistency", attr = b.dataset.legend === "shape" ? "shape" : "cons";
    d[key] = i; sh.querySelectorAll(`[data-${attr}]`).forEach((x) => x.classList.toggle("on", String(i) === x.dataset[attr]));
    const card = sh.querySelector(`[data-${attr}="${i}"]`); card?.scrollIntoView({ block: "nearest", inline: "center" });
    key === "shape" ? showShape() : showCons();
  }));
  sh.querySelectorAll("[data-star]").forEach((b) => b.onclick = () => {
    const n = +b.dataset.star; d.rating = d.rating === n ? null : n;
    sh.querySelectorAll("[data-star]").forEach((x) => x.classList.toggle("on", d.rating && +x.dataset.star <= d.rating));
  });
  const pr = $("#prange", sh);
  pr.oninput = () => {
    d.pressure = +pr.value; d.pressureSet = true; const i = pressInfo(d.pressure);
    $("#pface", sh).textContent = i.e; $("#pface", sh).style.transform = `scale(${1 + d.pressure / 300}) rotate(${(d.pressure - 50) / 6}deg)`;
    $("#plbl", sh).textContent = i.n; $("#pval", sh).textContent = d.pressure + " %";
  };
  const ftxt = () => {
    $("#fnum", sh).textContent = d.flushes;
    const msg = d.flushes === 0 ? "Gar nicht?! 🤢" : d.flushes === 1 ? "Sauberer Abgang" : d.flushes === 2 ? "Kommt vor" : d.flushes < 5 ? "Hartnäckiger Fall 😬" : "Klempner ist informiert 🔧";
    $("#ftxt", sh).innerHTML = `${"🚽".repeat(Math.min(d.flushes, 8))}${d.flushes > 8 ? "…" : ""}<small>${d.flushSet ? msg : "Tippe + oder −"}</small>`;
  };
  $("#fm", sh).onclick = () => { d.flushes = Math.max(0, d.flushes - 1); d.flushSet = true; ftxt(); };
  $("#fp", sh).onclick = () => { d.flushes = Math.min(20, d.flushes + 1); d.flushSet = true; ftxt(); };
  ftxt();
  $("#send", sh).onclick = async () => {
    const btn = $("#send", sh); btn.disabled = true; btn.textContent = "🚽 Wird runtergespült …";
    const ok = await submitLog({
      shape: d.shape, consistency: d.consistency, extras: d.extras.length ? d.extras : null, place: d.place, rating: d.rating,
      pressure: d.pressureSet ? d.pressure : null, flushes: d.flushSet ? d.flushes : null,
      comment: $("#cmt", sh).value.trim() || null,
    });
    if (ok) close(); else { btn.disabled = false; btn.textContent = "📣 Abschicken & alle informieren"; }
  };
}
async function submitLog(data) {
  const before = new Set(badges(myLogs(), S.friends.length).filter((b) => b.done).map((b) => b.id));
  try {
    const r = await fn("log", data);
    flushSound(); flushFX(); setTimeout(() => rain(), 500);
    S.logs.unshift(r.log); S.seenLog = Math.max(S.seenLog, r.log.id);
    S.tab = "feed"; renderView();
    const n = r.friends;
    toast(n ? `📣 ${n} ${n === 1 ? "Freund wurde" : "Freunde wurden"} informiert${r.push?.sent ? ` (${r.push.sent} Push${r.push.sent === 1 ? "" : "es"} raus)` : ""}!` : "Gespeichert! Lade Freunde ein, damit es jemand mitkriegt 😉", 4000);
    const fresh = badges(myLogs(), S.friends.length).filter((b) => b.done && !before.has(b.id));
    if (fresh.length) setTimeout(() => showUnlock(fresh), 1800);
    return true;
  } catch (e) { toast(e.message); return false; }
}
function showUnlock(list) {
  const b = list[0];
  const bd = document.createElement("div"); bd.className = "backdrop";
  const c = document.createElement("div"); c.className = "card unlock";
  c.innerHTML = `<div class="muted">Abzeichen freigeschaltet!</div><div class="e">${b.e}</div><h3>${esc(b.n)}</h3><p class="muted">${esc(b.d)}</p>${list.length > 1 ? `<p>+ ${list.length - 1} weitere 🎉</p>` : ""}<button class="btn white block">Stark! 💪</button>`;
  document.body.append(bd, c); rain(["🎖️", "⭐", "🎉", b.e], 30);
  const close = () => { bd.remove(); c.remove(); }; bd.onclick = close; c.querySelector("button").onclick = close;
}

// ---------- Rangliste ----------
function viewRank(v) {
  const since = S.period === "week" ? Date.now() - 7 * 864e5 : S.period === "month" ? Date.now() - 30 * 864e5 : 0;
  const L = S.logs.filter((l) => new Date(l.created_at) >= since);
  const people = [S.me, ...S.friends];
  const by = (f) => people.map((p) => { const ls = L.filter((l) => l.user_id === p.id); return { p, v: f(ls, p) }; }).filter((x) => x.v != null && !Number.isNaN(x.v));
  const avg = (ls, k) => { const xs = ls.map((l) => l[k]).filter((x) => x != null); return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null; };
  const board = (title, desc, rows, fmt) => {
    rows.sort((a, b) => b.v - a.v);
    return `<div class="card board"><h3>${title}</h3><div class="desc muted">${desc}</div>
      ${rows.length ? rows.slice(0, 10).map((r, i) => `<div class="rank ${r.p.id === S.me.id ? "me" : ""}"><div class="pos">${["🥇", "🥈", "🥉"][i] ?? i + 1}</div>${avaHTML(r.p)}<div class="nm">${esc(r.p.display_name)}</div><div class="val">${fmt(r.v)}</div></div>`).join("") : `<div class="muted">Noch keine Daten 🦗</div>`}</div>`;
  };
  const hours = Array(24).fill(0); L.forEach((l) => hours[new Date(l.created_at).getHours()]++);
  const mx = Math.max(1, ...hours), peak = hours.indexOf(Math.max(...hours));
  v.innerHTML = `
  <div class="seg">${[["week", "7 Tage"], ["month", "30 Tage"], ["all", "Ewig"]].map(([k, n]) => `<button data-p="${k}" class="${S.period === k ? "on" : ""}">${n}</button>`).join("")}</div>
  ${board("👑 Thron-König", "Die meisten Sitzungen", by((ls) => ls.length), (x) => `${x}×`)}
  ${board("🌊 Spül-Weltmeister", "Insgesamt gespült – die Stadtwerke danken", by((ls) => ls.reduce((a, l) => a + (l.flushes || 0), 0)), (x) => `${x} 🚽`)}
  ${board("🤰 Presslufthammer", "Höchster Ø-Druck beim Abgang", by((ls) => avg(ls, "pressure")), (x) => `${Math.round(x)} %`)}
  ${board("⭐ Qualitätskacker", "Beste Ø-Selbstbewertung", by((ls) => avg(ls, "rating")), (x) => `${x.toFixed(1)} 💩`)}
  ${board("🎨 Formen-Künstler", "Die meisten verschiedenen Formen", by((ls) => new Set(ls.map((l) => l.shape).filter(Boolean)).size || null), (x) => `${x} Formen`)}
  ${board("🛟 Schwimmmeister", "Die meisten Schwimmer – nichts geht unter", by((ls) => ls.filter((l) => l.extras?.includes("floater")).length || null), (x) => `${x}× 🛟`)}
  ${board("☣️ Biowaffen-Arsenal", "Am häufigsten Raum gesperrt", by((ls) => ls.filter((l) => l.extras?.includes("stink")).length || null), (x) => `${x}× ☣️`)}
  ${board("🔥 Längste Serie", "Tage am Stück (aktuell)", people.map((p) => ({ p, v: streak(S.logs.filter((l) => l.user_id === p.id)) })), (x) => `${x} Tg.`)}
  <div class="card board"><h3>🕰️ Klo-Uhr der Clique</h3><div class="desc muted">Wann wird bei euch geliefert? ${L.length ? `Stoßzeit: <b>${peak}–${peak + 1} Uhr</b>` : ""}</div>
    <div class="clock">${hours.map((h) => `<i style="height:${(h / mx) * 100}%" title="${h}"></i>`).join("")}</div>
    <div class="clock-l"><span>0</span><span>6</span><span>12</span><span>18</span><span>23 Uhr</span></div></div>`;
  v.querySelectorAll("[data-p]").forEach((b) => b.onclick = () => { S.period = b.dataset.p; renderView(); });
}

// ---------- Erfolge ----------
function viewBadges(v) {
  const bs = badges(myLogs(), S.friends.length), done = bs.filter((b) => b.done).length;
  v.innerHTML = `<div class="card" style="text-align:center;margin-bottom:14px;background:var(--purple);color:#fff">
    <div class="badge-count">${done} / ${bs.length}</div><div>Abzeichen freigeschaltet</div></div>
    <div class="badges">${bs.map((b) => `<div class="badge ${b.done ? "" : "locked"}"><span class="e">${b.e}</span><b>${esc(b.n)}</b><small>${esc(b.d)}</small>
      ${!b.done && b.goal > 1 ? `<div class="prog"><i style="width:${(b.cur / b.goal) * 100}%"></i></div><small>${b.cur}/${b.goal}</small>` : ""}</div>`).join("")}</div>`;
}

// ---------- Profil / Freunde ----------
const BASE = (C.appUrl || "https://klopost.github.io/").replace(/\/?$/, "/"); // fest, damit Links auch in einer späteren App (Capacitor) stimmen
const inviteLink = () => `${BASE}?invite=${S.me.invite_code}`;
async function shareInvite() {
  const text = `${S.me.emoji} ${S.me.display_name} will wissen, wann du auf dem Klo warst 😂 Komm in meinen Klo-Kreis bei Klopost:`;
  if (navigator.share) { try { await navigator.share({ title: "Klopost 💩📬", text, url: inviteLink() }); return; } catch (e) { if (e.name === "AbortError") return; } }
  try { await navigator.clipboard.writeText(`${text} ${inviteLink()}`); toast("📋 Einladungslink kopiert!"); } catch { prompt("Link kopieren:", inviteLink()); }
}
const STATUS = {
  friends: { t: "🤝 Befreundet", cls: "st-friends" },
  sent: { t: "⏳ Anfrage gesendet", cls: "st-sent" },
  received: { t: "📨 Anfrage erhalten", cls: "st-received" },
  none: { t: "", cls: "" },
};
function personRow(p, actions, sub) {
  return `<div class="friend person" data-uid="${p.id}">${avaHTML(p)}<div class="nm">${esc(p.display_name)}<small>@${esc(p.username)}${sub ? ` · ${sub}` : ""}</small></div><div class="acts">${actions}<button class="btn small white more" data-umenu="${p.id}" title="Melden / Blockieren" aria-label="Melden oder blockieren">⋯</button></div></div>`;
}
function actionsFor(p) {
  const st = p.status;
  if (st === "friends") return `<span class="pill st-friends">🤝 Befreundet</span>`;
  if (st === "sent") return `<span class="pill st-sent">⏳ Anfrage gesendet</span><button class="btn small white" data-fact="cancel" data-uid="${p.id}" title="Anfrage zurückziehen">↩️</button>`;
  if (st === "received") return `<button class="btn small mint" data-fact="accept" data-uid="${p.id}">✅ Annehmen</button><button class="btn small white" data-fact="decline" data-uid="${p.id}" title="Ablehnen">🚽</button>`;
  return `<button class="btn small" data-fact="request" data-uid="${p.id}">➕ Hinzufügen</button>`;
}
function renderReqs() {
  const box = $("#reqs"); if (!box) return;
  const inc = S.reqIn.map((p) => personRow(p, actionsFor({ ...p, status: "received" }), `seit ${rel(p.created_at)}`)).join("");
  const out = S.reqOut.map((p) => personRow(p, actionsFor({ ...p, status: "sent" }), `angefragt ${rel(p.created_at)}`)).join("");
  box.innerHTML = (inc ? `<section class="card req-card"><h3 class="req-h">🚪 Es klopft! <span class="cnt">${S.reqIn.length}</span></h3><p class="muted" style="margin:2px 0 6px;font-size:14px">${S.reqIn.length === 1 ? "Jemand will" : "Diese Leute wollen"} in deinen Klo-Kreis:</p>${inc}</section>` : "")
    + (out ? `<details class="card out-card"${S.reqOut.length <= 3 ? " open" : ""}><summary>⏳ Wartet auf Antwort (${S.reqOut.length})</summary>${out}</details>` : "");
  bindFriendActs(box);
}
let searchT = null, searchSeq = 0;
function bindSearch() {
  const inp = $("#fsearch"); if (!inp) return;
  const run = async () => {
    const q = S.q = inp.value.trim(); $("#fclear").hidden = !inp.value;
    const box = $("#fresults");
    if (q.length < 2) { S.results = null; box.innerHTML = q.length ? `<div class="muted hint-s">Noch ein Buchstabe … 🧐</div>` : ""; return; }
    const seq = ++searchSeq; box.innerHTML = `<div class="muted hint-s">🧻 Durchsuche die Kabinen …</div>`;
    try {
      const r = await fn("search", { q }); if (seq !== searchSeq) return;
      S.results = r.results; renderResults();
    } catch (e) { box.innerHTML = `<div class="err">${esc(e.message)}</div>`; }
  };
  inp.oninput = () => { clearTimeout(searchT); searchT = setTimeout(run, 300); };
  $("#fclear").onclick = () => { inp.value = ""; run(); inp.focus(); };
  if (S.q.length >= 2) run();
}
function renderResults() {
  const box = $("#fresults"); if (!box || !S.results) return;
  box.innerHTML = S.results.length ? S.results.map((p) => personRow(p, actionsFor(p), STATUS[p.status]?.t && p.status !== "friends" && p.status !== "sent" ? STATUS[p.status].t : "")).join("")
    : `<div class="empty-s"><div style="font-size:40px">🕳️</div>Niemand gefunden. Vielleicht noch nicht registriert? <a href="#" class="link" id="inv-s">Lade sie ein!</a></div>`;
  $("#inv-s") && ($("#inv-s").onclick = (e) => { e.preventDefault(); shareInvite(); });
  bindFriendActs(box);
}
function bindFriendActs(root) {
  root.querySelectorAll("[data-umenu]").forEach((b) => b.onclick = () => userMenu(b.dataset.umenu));
  root.querySelectorAll("[data-fact]").forEach((b) => b.onclick = async () => {
    const uid = b.dataset.uid, act = b.dataset.fact;
    const all = [...(S.results ?? []), ...S.reqIn, ...S.reqOut]; const p = all.find((x) => x.id === uid) || {};
    b.disabled = true;
    try {
      const r = await fn({ request: "friend_request", cancel: "cancel_request", accept: "accept_request", decline: "decline_request" }[act], { user_id: uid });
      if (navigator.vibrate) navigator.vibrate(15);
      if (act === "request") toast(r.status === "friends" ? `🤝 ${p.display_name} und du seid jetzt Klo-Kumpels!` : `📬 Anfrage an ${p.display_name} ist raus!${r.push?.sent ? " (Push zugestellt)" : ""}`);
      if (act === "cancel") toast("↩️ Anfrage zurückgezogen – keiner hat's gemerkt 🤫");
      if (act === "decline") toast("🚽 Anfrage runtergespült.");
      if (act === "accept") { toast(`🤝 ${p.display_name} ist jetzt in deinem Klo-Kreis!`, 4000); rain(["🤝", "💩", "🎉"], 30); }
      S.results?.forEach((x) => { if (x.id === uid) x.status = r.status; });
      if (act === "decline" || act === "accept") S.reqIn = S.reqIn.filter((x) => x.id !== uid);
      if (act === "cancel") S.reqOut = S.reqOut.filter((x) => x.id !== uid);
      if (r.status !== "friends") { updateReqBadge(); renderReqs(); renderResults(); }
      if (r.status === "friends") { await load(); const y = scrollY; renderView(); scrollTo(0, y); return; }
      const rr = await fn("requests"); S.reqIn = rr.incoming; S.reqOut = rr.outgoing; S.seenReq = S.reqIn.map((x) => x.id);
      updateReqBadge(); renderReqs(); renderResults();
    } catch (e) { toast(e.message); b.disabled = false; }
  });
}
function viewMe(v) {
  const mine = myLogs(), st = streak(mine), fl = mine.reduce((a, l) => a + (l.flushes || 0), 0);
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  v.innerHTML = `
  <div id="reqs"></div>
  <section class="card me-card">${avaHTML(S.me)}<h2 style="font-size:26px">${esc(S.me.display_name)}</h2><div class="muted">@${esc(S.me.username)}</div>
    <div class="statgrid"><div class="stat"><b>${mine.length}</b><small>Sitzungen</small></div><div class="stat"><b>${st} 🔥</b><small>Streak</small></div><div class="stat"><b>${fl}</b><small>Spülungen</small></div></div>
    <button class="btn white small" id="edit" style="margin-top:12px">✏️ Profil bearbeiten</button></section>

  <div class="section-title"><h3>🔎 Klo-Kumpels finden</h3></div>
  <section class="card search-card">
    <div class="search-wrap"><span class="mag">🔍</span><input class="inp" id="fsearch" type="search" placeholder="Benutzername oder Name …" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="24" value="${esc(S.q)}"><button class="clr" id="fclear" aria-label="Leeren" ${S.q ? "" : "hidden"}>✕</button></div>
    <div id="fresults" class="fresults"></div>
  </section>

  <div class="section-title"><h3>📨 Freunde einladen</h3></div>
  <section class="card invite-box">
    <div>Schick deinen Link – wer sich darüber registriert oder anmeldet, ist <b>sofort</b> in deinem Klo-Kreis:</div>
    <div class="code">${esc(S.me.invite_code)}</div>
    <button class="btn white block" id="share">📤 Einladungslink teilen</button>
    <div class="row" style="margin-top:12px"><input class="inp" id="codein" placeholder="Code eines Freundes" maxlength="8" style="text-transform:uppercase"><button class="btn small" id="codebtn">Los</button></div>
  </section>

  <div class="section-title"><h3>👯 Dein Klo-Kreis (${S.friends.length})</h3></div>
  <section class="card">${S.friends.length ? S.friends.map((f) => {
    const fl = S.logs.find((l) => l.user_id === f.id);
    return `<div class="friend">${avaHTML(f)}<div class="nm">${esc(f.display_name)}<small>@${esc(f.username)} · ${fl ? "zuletzt " + rel(fl.created_at) : "noch nie gemeldet"}</small></div>
      <button class="btn small sky" data-poke="${f.id}" title="Anstupsen">🚪 Klopf</button><button class="btn small white" data-rm="${f.id}" title="Entfernen">✖</button><button class="btn small white more" data-umenu="${f.id}" title="Melden / Blockieren" aria-label="Melden oder blockieren">⋯</button></div>`;
  }).join("") : `<div class="muted">Noch niemand. Teile oben deinen Link! 👆</div>`}</section>

  <div class="section-title"><h3>🔔 Push-Nachrichten</h3></div>
  <section class="card" id="pushcard">
    <div class="push-state" id="pstate">Prüfe …</div>
    <div class="row"><button class="btn mint" id="pon">🔔 Aktivieren</button><button class="btn white small" id="ptest">Test-Push</button><button class="btn white small" id="pdiagbtn" title="Diagnose">🩺</button></div>
    <div class="pdiag" id="pdiag" hidden></div>
    ${isIOS && !standalone ? `<div class="hint">📱 <b>iPhone/iPad:</b> Push klappt nur, wenn du Klopost zum Home-Bildschirm hinzufügst: In Safari unten auf <b>Teilen</b> <span style="font-size:18px">⎋</span> tippen → <b>„Zum Home-Bildschirm“</b> → App von dort öffnen und hier aktivieren (iOS 16.4+).</div>` : ""}
    ${!isIOS && !standalone ? `<div class="hint">💡 Tipp: Installiere Klopost als App (Browser-Menü → „App installieren“ / „Zum Startbildschirm“) – dann kommen Pushes am zuverlässigsten.</div>` : ""}
    <div class="row" style="margin-top:12px"><label class="row" style="gap:8px"><input type="checkbox" id="snd" ${S.sound ? "checked" : ""} style="width:20px;height:20px"> Spülgeräusch beim Melden 🔊</label></div>
  </section>

  <div class="section-title"><h3>⚙️ Konto &amp; Rechtliches</h3></div>
  <section class="card settings">
    <button class="setrow" id="s-blocks"><span>🚫 Blockierte Nutzer</span><b id="s-bcount">${S.blocked.size}</b></button>
    <div id="blist" hidden></div>
    <button class="setrow" id="s-export"><span>📦 Meine Daten herunterladen</span><small>JSON · Art. 15/20 DSGVO</small></button>
    ${LEGAL.map(([h, t]) => `<a class="setrow" href="${LEGAL_BASE}${h}" target="_blank" rel="noopener"><span>${t}</span><small>↗</small></a>`).join("")}
    <button class="setrow danger" id="s-delete"><span>🗑️ Konto löschen</span><small>endgültig</small></button>
  </section>

  <div style="text-align:center;margin-top:22px"><button class="btn white small" id="logout">🚪 Abmelden</button>
  <p class="muted" style="font-size:12px;margin-top:14px">Klopost · für Klatsch, nicht für Ärzte 🩺🚫</p></div>`;
  $("#share").onclick = shareInvite;
  renderReqs(); bindSearch();
  $("#codebtn").onclick = async () => {
    const code = $("#codein").value.trim().toUpperCase(); if (!code) return;
    try { const r = await fn("accept_invite", { code }); if (r.self) toast("Das ist dein eigener Code 😄"); else { toast(`🤝 ${r.friend.emoji} ${r.friend.display_name} ist jetzt in deinem Klo-Kreis!`); await load(); renderView(); } }
    catch (e) { toast(e.message); }
  };
  v.querySelectorAll("[data-poke]").forEach((b) => b.onclick = async () => {
    try { const r = await fn("poke", { friend_id: b.dataset.poke }); toast(r.sent ? "🚪 Klopf klopf – angestupst!" : "Angestupst – aber dein Freund hat Push noch nicht aktiviert 🤷"); } catch (e) { toast(e.message); }
  });
  v.querySelectorAll("[data-rm]").forEach((b) => b.onclick = async () => {
    const f = S.profiles[b.dataset.rm]; if (!confirm(`${f.display_name} wirklich aus deinem Klo-Kreis werfen?`)) return;
    await fn("remove_friend", { friend_id: f.id }).catch((e) => toast(e.message)); await load(); renderView();
  });
  $("#edit").onclick = editProfile;
  $("#logout").onclick = async () => { await unsubscribePush(true); S.me = null; S.q = ""; S.results = null; S.reqIn = []; S.reqOut = []; S.seenReq = null; stopPoll(); await sb.auth.signOut(); renderAuth("login"); };
  $("#pon").onclick = onPushTap;
  $("#s-blocks").onclick = toggleBlocks; $("#s-export").onclick = () => exportData(); $("#s-delete").onclick = deleteAccountSheet; $("#pdiagbtn").onclick = () => { const el = $("#pdiag"); if (el.hidden) showPushDiag(); else el.hidden = true; };
  $("#ptest").onclick = async () => { try { const r = await fn("test_push"); toast(r.sent ? "🧻 Test-Push gesendet!" : "Kein Push-Abo auf diesem Konto – erst aktivieren 🔔"); } catch (e) { toast(e.message); } };
  $("#snd").onchange = (e) => { S.sound = e.target.checked; localStorage.setItem("kt-sound", S.sound ? "on" : "off"); if (S.sound) flushSound(); };
  refreshPushState();
}
function editProfile() {
  let ava = S.me.emoji;
  const bd = document.createElement("div"); bd.className = "backdrop";
  const sh = document.createElement("div"); sh.className = "sheet";
  sh.innerHTML = `<div class="grab"></div><h2>Profil bearbeiten</h2>
    <label class="f">Anzeigename</label><input class="inp" id="dn" maxlength="24" value="${esc(S.me.display_name)}">
    <label class="f">Avatar</label><div class="emoji-grid">${AVATARS.map((a) => `<button type="button" data-a="${a}" class="${a === ava ? "on" : ""}">${a}</button>`).join("")}</div>
    <div class="sheet-actions"><button class="btn pink block" id="sv">Speichern</button></div>`;
  document.body.append(bd, sh);
  const close = () => { bd.remove(); sh.remove(); }; bd.onclick = close;
  sh.querySelectorAll("[data-a]").forEach((b) => b.onclick = () => { ava = b.dataset.a; sh.querySelectorAll("[data-a]").forEach((x) => x.classList.toggle("on", x === b)); });
  $("#sv", sh).onclick = async () => {
    try { const p = await fn("update_profile", { display_name: $("#dn", sh).value.trim(), emoji: ava }); S.profiles[p.id] = S.me = p; close(); renderShell(); toast("Gespeichert ✨"); } catch (e) { toast(e.message); }
  };
}

// ---------- Service Worker & Push ----------
let swReg = null;
async function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  try { swReg = await navigator.serviceWorker.register("sw.js", { scope: "./" }); swReg.update().catch(() => {}); } catch (e) { console.warn(e); }
  navigator.serviceWorker.addEventListener("message", (e) => { if (e.data?.type === "open" && e.data.url?.includes("#friends")) { refresh().then(() => { S.tab = "me"; renderView(); scrollTo(0, 0); }); return; }
    if (e.data?.type === "open" && e.data.url?.includes("#log-")) { refresh().then(() => focusLog(e.data.url.split("#log-")[1])); } });
  // Push-Abo still erneuern, falls Berechtigung schon da ist
  if (window.Notification && Notification.permission === "granted") enablePush(true);
  updateBell();
}
const b64ToU8 = (b) => { const p = "=".repeat((4 - (b.length % 4)) % 4); const s = atob((b + p).replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from([...s].map((c) => c.charCodeAt(0))); };
const isIOSDev = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isStandalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
const iosVer = () => { const m = navigator.userAgent.match(/OS (\d+)[_.](\d+)/); return m ? `${m[1]}.${m[2]}` : null; };
function pushDiag(err) {
  const d = {
    "Gerät": isIOSDev() ? `iOS ${iosVer() || "?"}` : (navigator.userAgentData?.platform || navigator.platform || "?"),
    "Als App geöffnet": isStandalone() ? "ja" : "nein",
    "Adresse": location.origin + location.pathname,
    "Notification": window.Notification ? Notification.permission : "fehlt",
    "PushManager": "PushManager" in window ? "ja" : "nein",
    "Service Worker": !("serviceWorker" in navigator) ? "fehlt" : navigator.serviceWorker.controller ? "aktiv" : swReg ? (swReg.active ? "registriert" : "startet …") : "nicht registriert",
  };
  if (err) d["Fehler"] = err;
  return d;
}
function showPushDiag(err) {
  const el = $("#pdiag"); if (!el) return;
  const d = pushDiag(err);
  el.hidden = false;
  el.innerHTML = `<b>🩺 Push-Diagnose</b> <small>(bei Problemen Screenshot machen 📸)</small><table>${Object.entries(d).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(String(v))}</td></tr>`).join("")}</table>`;
}
// Klick-Handler: KEIN await vor requestPermission (Safari verlangt die Nutzergeste)
function onPushTap() {
  const ios = isIOSDev();
  if (ios && !isStandalone()) return pushFail("Auf dem iPhone geht Push nur aus der Home-Bildschirm-App: Teilen ⎋ → „Zum Home-Bildschirm“ → Klopost dort öffnen 📱");
  if (ios && iosVer() && parseFloat(iosVer()) < 16.4) return pushFail(`Dein iOS ${iosVer()} ist zu alt – Push braucht iOS 16.4 oder neuer 📵`);
  if (!("serviceWorker" in navigator)) return pushFail("Dieser Browser hat keinen Service Worker – Push nicht möglich (privater Modus?)");
  if (!("PushManager" in window) || !window.Notification) return pushFail(ios ? "Push nicht verfügbar – bitte Klopost neu zum Home-Bildschirm hinzufügen (alte Verknüpfung löschen) 📱" : "Dein Browser kann leider keine Push-Nachrichten");
  if (Notification.permission === "denied") return pushFail(ios ? "Benachrichtigungen sind blockiert: iPhone-Einstellungen → Mitteilungen → Klopost → Erlauben" : "Benachrichtigungen sind blockiert: Schloss-Symbol in der Adressleiste → Benachrichtigungen → Zulassen");
  let pr;
  try { pr = Notification.requestPermission(); } catch (e) { return pushFail("requestPermission: " + e.message); }
  if (!pr || typeof pr.then !== "function") pr = new Promise((res) => Notification.requestPermission(res));
  const b = $("#pon"); if (b) { b.disabled = true; b.textContent = "⏳ Moment …"; }
  pr.then((perm) => enablePush(false, perm)).finally(() => { const b2 = $("#pon"); if (b2) b2.disabled = false; });
}
function pushFail(msg) { toast(msg, 6000); showPushDiag(msg); refreshPushState(); updateBell(); return false; }
async function swReady() {
  if (!swReg) { try { swReg = await navigator.serviceWorker.register("sw.js", { scope: "./" }); } catch (e) { throw new Error("Service Worker ließ sich nicht registrieren: " + e.message); } }
  if (swReg.active) return swReg;
  return await Promise.race([navigator.serviceWorker.ready, new Promise((_, rej) => setTimeout(() => rej(new Error("Service Worker startet nicht (Timeout) – App einmal komplett schließen und neu öffnen")), 10000))]);
}
async function enablePush(silent = false, perm) {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !window.Notification) throw new Error("Push wird hier nicht unterstützt");
    perm = perm || Notification.permission;
    if (perm !== "granted") throw new Error(perm === "denied" ? "Benachrichtigungen wurden abgelehnt 😢 – in den Einstellungen erlauben" : "Benachrichtigungen nicht erlaubt (Dialog geschlossen?) – nochmal tippen");
    const reg = await swReady();
    let sub = await reg.pushManager.getSubscription();
    if (sub && localStorage.getItem("kt-vapid") && localStorage.getItem("kt-vapid") !== C.vapidPublicKey) { await sub.unsubscribe().catch(() => {}); sub = null; }
    if (!sub) {
      try { sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToU8(C.vapidPublicKey) }); }
      catch (e) { throw new Error(`Abo fehlgeschlagen (${e.name}): ${e.message}`); }
    }
    localStorage.setItem("kt-vapid", C.vapidPublicKey);
    try { await fn("subscribe", { subscription: sub.toJSON() }); } catch (e) { throw new Error("Abo konnte nicht gespeichert werden: " + e.message); }
    const old = localStorage.getItem("kt-ep"); if (old && old !== sub.endpoint) fn("unsubscribe", { endpoint: old }).catch(() => {});
    localStorage.setItem("kt-ep", sub.endpoint);
    const dg = $("#pdiag"); if (dg) dg.hidden = true;
    if (!silent) { toast("🔔 Push aktiv! Du verpasst keinen Schiss mehr."); rain(["🔔", "💩"], 20); }
  } catch (e) { console.warn("push", e); if (!silent) { toast(e.message, 6000); showPushDiag(e.message); } }
  refreshPushState(); updateBell();
}
async function unsubscribePush(quiet) {
  try { const reg = swReg || await navigator.serviceWorker?.getRegistration(); const sub = await reg?.pushManager.getSubscription(); if (sub) { await fn("unsubscribe", { endpoint: sub.endpoint }).catch(() => {}); if (!quiet) await sub.unsubscribe(); } } catch {}
}
async function pushActive() {
  try { if (!window.Notification || Notification.permission !== "granted") return false; const reg = swReg || await navigator.serviceWorker.getRegistration(); return !!(await reg?.pushManager.getSubscription()); } catch { return false; }
}
async function refreshPushState() {
  const el = $("#pstate"); if (!el) return;
  const on = await pushActive();
  el.innerHTML = on ? `<span class="ok">✅ Aktiv auf diesem Gerät.</span> Du bekommst Bescheid, wenn deine Freunde abladen.`
    : isIOSDev() && !isStandalone() ? `<span class="bad">📱 Nur in der App.</span> Auf dem iPhone geht Push nur, wenn du Klopost vom Home-Bildschirm aus öffnest.`
    : !("PushManager" in window) ? `<span class="bad">🚫 Nicht unterstützt.</span> Dieser Browser kann keine Push-Nachrichten.`
    : window.Notification?.permission === "denied" ? `<span class="bad">🚫 Blockiert.</span> Erlaube Benachrichtigungen in den Browser-/System-Einstellungen.`
    : `<span class="bad">⏸️ Aus.</span> Aktiviere Push, damit du live mitbekommst, wer gerade auf dem Thron war.`;
  const pon = $("#pon"); if (pon) pon.textContent = on ? "🔄 Erneuern" : "🔔 Aktivieren";
}
async function updateBell() { const b = $("#bell"); if (b) b.classList.toggle("off", !(await pushActive())); }

// ---------- Live-Aktualisierung ----------
async function refresh() {
  const prevTop = S.seenLog;
  await load();
  const fresh = S.logs.filter((l) => l.id > prevTop && l.user_id !== S.me.id);
  if (fresh.length) { S.seenLog = S.logs[0].id; const p = S.profiles[fresh[0].user_id]; toast(`${p?.emoji ?? "💩"} ${fresh[0].headline}`); }
  const known = new Set(S.seenReq ?? []);
  const newReq = S.seenReq ? S.reqIn.filter((r) => !known.has(r.id)) : [];
  S.seenReq = S.reqIn.map((r) => r.id);
  if (newReq.length) toast(`🚽 ${newReq[0].emoji} ${newReq[0].display_name} will dein Klo-Kumpel werden!`, 4500);
  const sheetOpen = !!document.querySelector(".sheet, .legend");
  const typing = S.tab === "me" && (S.q || document.activeElement?.id === "fsearch");
  if (typing) { updateReqBadge(); renderReqs(); return; }
  if (!sheetOpen) { const y = scrollY; renderView(); scrollTo(0, y); }
}
function startPoll() { stopPoll(); S.pollT = setInterval(() => { if (document.visibilityState === "visible" && S.me) refresh().catch(() => {}); }, 15000); }
function stopPoll() { clearInterval(S.pollT); }
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && S.me) refresh().catch(() => {}); });
window.addEventListener("hashchange", () => { if (location.hash === "#friends" && S.me) { S.tab = "me"; refresh().catch(() => {}); return; } if (location.hash.startsWith("#log-") && S.me) refresh().then(() => focusLog(location.hash.slice(5))); });

sb.auth.onAuthStateChange((ev) => { if (ev === "SIGNED_OUT" && S.me) { S.me = null; renderAuth("login"); } });
start().catch((e) => { console.error(e); app.innerHTML = `<div class="boot"><div class="boot-poop">🚱</div><p>Verstopfung im System: ${esc(e.message)}</p><button class="btn" onclick="location.reload()">Nochmal spülen</button></div>`; });


// ---------- Melden & Blockieren (App Store 1.2) ----------
const REASONS = [["offensive", "🤮 Anstößig – selbst für Klo-Niveau zu viel"], ["harassment", "😠 Beleidigung / Mobbing"], ["spam", "📢 Spam"], ["fake", "🎭 Fake-Profil / gibt sich als jemand aus"], ["minor", "🧒 Wirkt jünger als 16"], ["other", "❓ Sonstiges"]];
function postMenu(logId) {
  const l = S.logs.find((x) => x.id === logId); if (!l) return;
  const p = S.profiles[l.user_id] || {};
  const { sh, close } = openSheet(`<h2>Was ist los? 🤔</h2>
    <div class="menu-list">
      <button class="btn white block" data-a="report">🚩 Eintrag melden</button>
      <button class="btn white block" data-a="block">🚫 ${esc(p.display_name || "Nutzer")} blockieren</button>
      <button class="btn white block" data-close>Abbrechen</button></div>`);
  sh.querySelector('[data-a="report"]').onclick = () => { close(); reportSheet({ log_id: logId, user_id: l.user_id }); };
  sh.querySelector('[data-a="block"]').onclick = () => { close(); blockUser(l.user_id); };
}
function personById(uid) { return S.profiles[uid] || [...(S.results ?? []), ...S.reqIn, ...S.reqOut].find((x) => x.id === uid) || { id: uid, display_name: "Nutzer", username: "?" }; }
function userMenu(uid) {
  const p = personById(uid);
  const { sh, close } = openSheet(`<h2>${esc(p.emoji || "")} ${esc(p.display_name)} <small class="muted">@${esc(p.username)}</small></h2>
    <div class="menu-list">
      <button class="btn white block" data-a="report">🚩 Profil melden</button>
      <button class="btn white block" data-a="block">🚫 Blockieren</button>
      <button class="btn white block" data-close>Abbrechen</button></div>`);
  sh.querySelector('[data-a="report"]').onclick = () => { close(); reportSheet({ user_id: uid }); };
  sh.querySelector('[data-a="block"]').onclick = () => { close(); blockUser(uid); };
}
function reportSheet(t) {
  const p = personById(t.user_id);
  const { sh, close } = openSheet(`<h2>🚩 ${t.log_id ? "Eintrag" : "Profil"} melden</h2>
    <p class="muted" style="margin-top:-4px">Klo-Humor ist hier erlaubt 💩 – aber kein Mobbing, nichts Ekliges von Fremden, nichts Illegales. Wir schauen uns jede Meldung an (meist innerhalb von 24 h).</p>
    <div class="reasons">${REASONS.map(([k, t2], i) => `<label class="cbx"><input type="radio" name="reason" value="${k}" ${i === 0 ? "" : ""}><span>${t2}</span></label>`).join("")}</div>
    <label class="f">Details (optional)</label><textarea class="inp" id="rnote" maxlength="500" rows="2" placeholder="Was genau ist passiert?"></textarea>
    <label class="cbx"><input type="checkbox" id="rblock" checked><span>${esc(p.display_name)} auch <b>blockieren</b> (sieht dich nicht mehr, keine Anfragen, keine Pushs)</span></label>
    <div class="sheet-actions"><button class="btn pink block" id="rsend">🚩 Meldung abschicken</button></div>`);
  sh.querySelector("#rsend").onclick = async () => {
    const reason = sh.querySelector('[name="reason"]:checked')?.value;
    if (!reason) return toast("Bitte einen Grund auswählen 👆");
    const block = sh.querySelector("#rblock").checked;
    try {
      await fn("report", { ...t, reason, note: sh.querySelector("#rnote").value.trim(), block });
      close(); toast(block ? "🚩 Gemeldet & blockiert. Danke, dass du den Thron sauber hältst! 🧽" : "🚩 Gemeldet. Danke, dass du den Thron sauber hältst! 🧽", 4500);
      if (block) { await load(); renderView(); }
    } catch (e) { toast(e.message); }
  };
}
async function blockUser(uid) {
  const p = personById(uid);
  if (!confirm(`${p.display_name} blockieren?\n\nIhr seid dann keine Klo-Kumpels mehr, ihr seht eure Einträge nicht, und ${p.display_name} kann dir keine Anfragen oder Pushs mehr schicken. Entsperren geht jederzeit unter ⚙️.`)) return;
  try { await fn("block", { user_id: uid }); toast(`🚫 ${p.display_name} ist blockiert. Tür zu! 🚪`); S.results = S.results?.filter((x) => x.id !== uid) ?? null; await load(); renderView(); }
  catch (e) { toast(e.message); }
}
async function toggleBlocks() {
  const box = $("#blist"); if (!box) return;
  if (!box.hidden) { box.hidden = true; return; }
  box.hidden = false; box.innerHTML = `<div class="muted hint-s">Lade …</div>`;
  try {
    const r = await fn("blocks");
    box.innerHTML = r.blocked.length ? r.blocked.map((p) => `<div class="friend person">${avaHTML(p)}<div class="nm">${esc(p.display_name)}<small>@${esc(p.username)}</small></div><div class="acts"><button class="btn small white" data-unblock="${p.id}">🔓 Entsperren</button></div></div>`).join("")
      : `<div class="muted hint-s">Niemand blockiert. Friede auf allen Thronen. 🕊️</div>`;
    box.querySelectorAll("[data-unblock]").forEach((b) => b.onclick = async () => { await fn("unblock", { user_id: b.dataset.unblock }).catch((e) => toast(e.message)); toast("🔓 Entsperrt"); await load(); renderView(); setTimeout(toggleBlocks, 50); });
  } catch (e) { box.innerHTML = `<div class="err">${esc(e.message)}</div>`; }
}

// ---------- DSGVO: Export & Konto löschen ----------
async function exportData() {
  try {
    const r = await fn("export");
    const blob = new Blob([JSON.stringify(r.export, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `klopost-daten-${S.me?.username || "ich"}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast("📦 Deine Klo-Akte ist heruntergeladen!");
    return true;
  } catch (e) { toast(e.message); return false; }
}
function deleteAccountSheet() {
  const u = S.me.username;
  const { sh, close } = openSheet(`<h2>🗑️ Konto endgültig löschen?</h2>
    <p>Das wird <b>komplett runtergespült</b> – ohne Rückholtaste:</p>
    <ul class="del-list"><li>💩 alle deine Einträge & Kommentare</li><li>🔥 deine Reaktionen</li><li>👯 Freundschaften, Anfragen & Blockierungen</li><li>🔔 Push-Abos</li><li>🪪 Profil & Login</li></ul>
    <button class="btn white block" id="dexp">📦 Vorher meine Daten herunterladen</button>
    <label class="f">Zur Bestätigung tippe deinen Benutzernamen: <b>${esc(u)}</b></label>
    <input class="inp" id="dconf" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="${esc(u)}">
    <div class="sheet-actions"><button class="btn danger block" id="dgo" disabled>🚽 Endgültig runterspülen</button><button class="btn white block" data-close>Lieber doch nicht</button></div>`, "danger-sheet");
  const inp = sh.querySelector("#dconf"), go = sh.querySelector("#dgo");
  inp.oninput = () => { go.disabled = inp.value.trim().toLowerCase() !== u; };
  sh.querySelector("#dexp").onclick = exportData;
  go.onclick = async () => {
    go.disabled = true; go.textContent = "⏳ Spüle …";
    try {
      await fn("delete_account", { confirm: inp.value.trim() });
      try { const reg = await navigator.serviceWorker?.getRegistration(); const sub = await reg?.pushManager?.getSubscription(); await sub?.unsubscribe(); } catch { /* egal */ }
      ["kt-ep", "kt-vapid", "kt-invite"].forEach((k) => localStorage.removeItem(k));
      close(); stopPoll(); S.me = null; S.q = ""; S.results = null; S.reqIn = []; S.reqOut = []; S.blocked = new Set();
      await sb.auth.signOut().catch(() => {}); await renderAuth("register");
      toast("👋 Konto gelöscht. Alles weg. Gute Verdauung im echten Leben!", 6000);
    } catch (e) { toast(e.message); go.disabled = false; go.textContent = "🚽 Endgültig runterspülen"; }
  };
}

// ---------- Einwilligung für Bestandskonten / Sperre ----------
function renderConsentGate() {
  stopPoll();
  app.innerHTML = `<div class="auth">
    <div class="logo"><img class="applogo" src="icons/logo.svg" alt="Klopost-Logo" width="88" height="88"><h1 class="fred">Klo<span>post</span></h1></div>
    <form class="card" id="consf">
      <h2 style="margin-top:0">📜 Kurz was Rechtliches</h2>
      <p class="muted">Hallo ${esc(S.me.display_name)}! Damit Klopost sauber bleibt (rechtlich – der Rest ist eh hoffnungslos 😅), brauchen wir einmal dein OK:</p>
      <div class="consents">${CONSENT_HTML}</div>
      <div class="err" id="cerr"></div>
      <button class="btn pink block" type="submit">Zustimmen &amp; weiter 🚀</button>
      <button class="btn white block" type="button" id="cno" style="margin-top:10px">Nicht einverstanden → Konto löschen</button>
      <button class="btn white small" type="button" id="clo" style="margin-top:10px">🚪 Abmelden</button>
    </form>
    ${legalLinks()}
  </div>`;
  $("#consf").onsubmit = async (ev) => {
    ev.preventDefault(); const c = readConsent(ev.target);
    if (!c.age || !c.terms || !c.health) { $("#cerr").textContent = "Bitte alle drei Häkchen setzen – sonst geht's leider nicht 🙏"; return; }
    try { await fn("consent", { consent: c }); await start(); } catch (e) { $("#cerr").textContent = e.message; }
  };
  $("#cno").onclick = () => deleteAccountSheet();
  $("#clo").onclick = async () => { await sb.auth.signOut(); renderAuth("login"); };
}
function renderBanned() {
  stopPoll();
  app.innerHTML = `<div class="auth"><div class="card" style="text-align:center"><div style="font-size:64px">🚫</div><h2>Konto gesperrt</h2>
    <p class="muted">Dein Konto wurde wegen Verstößen gegen die Community-Regeln gesperrt. Du kannst deine Daten trotzdem herunterladen oder dein Konto löschen.</p>
    <button class="btn white block" id="bexp">📦 Daten herunterladen</button><button class="btn danger block" id="bdel" style="margin-top:10px">🗑️ Konto löschen</button>
    <button class="btn white small" id="blo" style="margin-top:10px">🚪 Abmelden</button></div>${legalLinks()}</div>`;
  $("#bexp").onclick = exportData; $("#bdel").onclick = deleteAccountSheet; $("#blo").onclick = async () => { await sb.auth.signOut(); renderAuth("login"); };
}
})();
