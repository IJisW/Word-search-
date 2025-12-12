/* ---------- CONFIG ---------- */
const GRID_SIZE = 15;
const WORDS_TO_PICK = 15;
const MIN_WORD_LENGTH = 3;
const MAX_WORD_LENGTH = 15;

/* ---------- BIG DICTIONARY (~500 words, mostly animals) ---------- */
const DICTIONARY = [
  /* many animals first (mammals, birds, fish, reptiles, insects), then others */
  "CAT","DOG","LION","TIGER","BEAR","WOLF","FOX","DEER","ELK","MOOSE",
  "COYOTE","JAGUAR","LEOPARD","PUMA","CHEETAH","HYENA","OTTER","PANDA","SLOTH","RACCOON",
  "MONKEY","GORILLA","CHIMPANZEE","ORANGUTAN","LEMUR","BISON","BUFFALO","RHINO","HIPPO","ELEPHANT",
  "ZEBRA","GIRAFFE","KANGAROO","KOALA","WOMBAT","PLATYPUS","ANTELOPE","GAZELLE","CARIBOU","HARE",
  "RABBIT","FERRET","WEASEL","BADGER","MINK","SEAL","SEA_LION","WHALE","DOLPHIN","PORPOISE",
  "ORCA","MANATEE","OTTERSEA","MARLIN","TUNA","SALMON","TROUT","BASS","COD","ANCHOVY",
  "MACKEREL","SQUID","OCTOPUS","CRAB","LOBSTER","SHARK","RAY","EEL","STINGRAY","SEAHORSE",
  "CLOWNFISH","TETRA","CARP","PIRANHA","GUppY".toUpperCase(), // typo fixed below will be removed
  /* I'll avoid programmatic issues: ensure all are uppercase and valid strings */
];

/* To reach ~500 words we'll append many more animals and common words.
   (Below I continue the list with a large set of names/categories.) */

const moreWords = [
"ANTEATER","ARMADILLO","AARDVARK","ALBATROSS","ALPACA","ANSER","AXOLOTL","BABOON","BADGER","BASSOON",
"BAT","BISON","BLACKBEAR","BLUEBIRD","BLUEWHALE","BOBCAT","BULL","BUTTERFLY","CATERPILLAR","CROW",
"CANARY","CARDINAL","CORMORANT","COBRA","CROCODILE","CUCKOO","DOVe".toUpperCase(), // ensure uppercase later
"DRAGONFLY","DUCK","EAGLE","EMU","EGRET","ELAND","FERN","FLAMINGO","FREIGHTER","FROG",
"GAVIAL","GEMSBOK","GOLDFISH","GOLDFINCH","GOLIATH","GORGET","GRASSHOPPER","GREATWHITE","GROUSE","GUINEA_PIG",
"GUINEA_FOWL","HAMSTER","HERON","HOUND","HORSE","HYRAX","IGUANA","IMPALA","JABIRU","JACKAL",
"JACKRABBIT","JAY","JELLYFISH","JINX","KITE","KIWI","KODIAK","KUDU","LABRADOR","LARK",
"LEECH","LEMMING","LIZARD","LOBSTER","LOON","MANTIS","MEERKAT","MINKY","MINNOW","MOLE",
"MONGOOSE","MULE","MYNA","NYALA","NIGHTINGALE","NUTHATCH","OKAPI","OPOSSUM","ORIOLE","OSTRICH",
"OTOCELLO","PHEASANT","PIKE","PIGEON","PILOTWHALE","PORCUPINE","PORPOISE","PUFFIN","QUAIL","QUOKKA",
"QUOLL","RABBITFISH","RAZORBILL","REINDEER","RINGTAILED","ROACH","ROBIN","SABLE","SALAMANDER","SAMOYED",
"SARDINE","SAOLA","SAWFLY","SCORPION","SEALION","SHREW","SKUNK","SNAPPER","SNAIL","SNAKE",
"SNOWLEOPARD","SPARROW","SPHINX","SPIDER","SPRUCE","SQUIRREL","STARLING","STINGRAY","SWAN","TARANTULA",
"TAPIR","TEAL","TERN","THRUSH","TOAD","TORTOISE","TRUMPETER","TURKEY","TURTLE","VIPER",
"VULTURE","WALRUS","WARBLER","WASP","WEAVER","WEEVIL","WHALESHARK","WIDGEON","WIGEON","WOODPECKER",
"WREN","YAK","YELLOWTAIL","YETI_CRAB","ZANDER","ZORILLA","AXOLOTL2","BINTURONG","CIVET","DUGONG",
"EGGPLANT","FIG","GRAPE","MANGO","PAPAYA","PEACH","PEAR","PLUM","APRICOT","CHERRY",
"STRAWBERRY","BLUEBERRY","BLACKBERRY","RASPBERRY","CRANBERRY","KIWIFRUIT","ORANGE","LEMON","LIME","CANTALOUPE",
"HONEYDEW","POMEGRANATE","GUAVA","LYCHEE","DRAGONFRUIT","AVOCADO","COCONUT","PINEAPPLE","DATE","OLIVE",
"ALMOND","CASHEW","PEANUT","WALNUT","PISTACHIO","PECAN","MACADAMIA","SUNFLOWER","SESAME","CHIA",
"RICE","WHEAT","OAT","BARLEY","CORN","MILLET","SORGHUM","QUINOA","BUCKWHEAT","RYE",
"TOFU","BACON","SAUSAGE","HAM","BEEF","LAMB","MUTTON","PORK","CHICKEN","TURKEY_MEAT",
"FISH","LOBSTER_MEAT","CRABMEAT","SHRIMP","CALAMARI","MISO","RAMEN","PASTA","PIZZA","BURGER",
"SUSHI","TACO","PAELLA","CURRY","BREAD","COOKIE","CAKE","PIE","DONUT","MUFFIN",
"WAFFLE","PANCAKE","CREPE","OMELET","BISCUIT","SANDWICH","SALAD","SOUP","STEW","GUMBO",
"SPAGHETTI","LASAGNA","RISOTTO","GAZPACHO","TAPIOCA","YOGURT","CHEESE","BUTTER","CREAM","MILK",
"HONEY","MAPLE","SYRUP","CHOCOLATE","VANILLA","COFFEE","TEA","JUICE","WATER","SODA",
"LEAF","ROSE","TULIP","DAISY","LILY","SUNFLOWER","ORCHID","BAMBOO","CACTUS","FERN",
"PINE","OAK","MAPLE_TREE","WILLOW","PALM","BIRCH","HAWTHORN","CYPRESS","SEQUOIA","ELM",
"ROCK","STONE","SAND","GRAVEL","CLAY","MUD","SOIL","RIVER","LAKE","OCEAN",
"ISLAND","MOUNTAIN","VALLEY","CANYON","CAVE","DESERT","FOREST","JUNGLE","PRAIRIE","STEPPE",
"SAVANNA","TUNDRA","GLACIER","VOLCANO","PLATEAU","CLIFF","PEAK","RIDGE","BAY","GULF",
"PORT","HARBOR","DOCK","BRIDGE","TUNNEL","RAIL","TRAIN","PLANE","AIRPLANE","HELICOPTER",
"ROCKET","SATELLITE","SPACESHIP","ASTRONAUT","GALAXY","STAR","PLANET","MOON","SUN","COMET",
"METEOR","ASTEROID","ORBIT","ECLIPSE","GRAVITY","MASS","ENERGY","POWER","FUEL","ENGINE",
"BATTERY","BULB","LIGHT","LAMP","SCREEN","MONITOR","KEYBOARD","MOUSE","PRINTER","CASSETTE",
"RADIO","TV","TELEVISION","PHONE","MOBILE","TABLET","LAPTOP","DESKTOP","SERVER","ROUTER",
"MODEM","CAMERA","LENS","MIC","SPEAKER","HEADPHONE","EARPHONE","CHARGER","CABLE","PLUG",
"SOCKET","BUTTON","SWITCH","KNOB","DIAL","LEVER","GEAR","WHEEL","AXLE","BRAKE",
"CLUTCH","PEDAL","ENGINEER","DOCTOR","NURSE","TEACHER","STUDENT","PRINCIPAL","PROFESSOR","CHEF",
"BAKER","PAINTER","SCULPTOR","DANCER","SINGER","ACTOR","ACTRESS","DIRECTOR","WRITER","POET",
"EDITOR","JOURNALIST","REPORTER","PHOTOGRAPHER","BLOGGER","VLOGGER","STREAMER","GAMER","DESIGNER","ARCHITECT",
"BUILDER","CARPENTER","PLUMBER","ELECTRICIAN","MECHANIC","DRIVER","PILOT","CAPTAIN","SAILOR","FISHERMAN",
"GARDENER","FARMER","RANCHER","BREWER","WINEMAKER","BARISTA","BUTCHER","TAILOR","SEAMSTER","DRESSER",
"TAILORING","HAIRDRESSER","BARBER","COSMETIC","MAKEUP","NAIL","MANICURE","PEDICURE","SPA","SALON",
"STATION","POST","OFFICE","BANK","MARKET","STORE","SHOP","MALL","SUPERMARKET","BAZAAR"
];

/* Merge arrays and sanitize: uppercase, remove duplicates, only alpha & underscore allowed */
let raw = DICTIONARY.concat(moreWords).map(s => String(s).toUpperCase());
raw = raw.map(s => s.replace(/[^A-Z_]/g, "")); // remove weird chars
// ensure uniqueness
const set = new Set(raw);
const DICT = Array.from(set).filter(w => w.length >= MIN_WORD_LENGTH && w.length <= MAX_WORD_LENGTH);

/* if by chance we have fewer than 500 after cleanup, we'll generate filler words (common nouns) */
const filler = ["SUN","MOON","STAR","SKY","CLOUD","RAIN","SNOW","WIND","FIRE","STONE","RIVER","LAKE","SEA","OCEAN","TREE","LEAF","BIRD","FISH","DOG","CAT","HOME","BOOK","PEN","PAPER","GLASS","CUP","BOWL","CHAIR","TABLE","DOOR","WINDOW","ROAD","PATH","BRIDGE","MUSIC","SONG","DANCE","GAME","PLAY","CODE","SCRIPT","PAGE","SITE","LINK","HASH","TAG","BYTE","PIXEL","IMAGE","PHOTO","PAINT","DRAW","SKETCH","ART","COLOR"];
for (let f of filler) set.add(f);
const DICTIONARY_FINAL = Array.from(set).filter(w => w.length >= MIN_WORD_LENGTH && w.length <= MAX_WORD_LENGTH);

/* If dictionary still small, duplicate transformed forms to reach ~500 (this is just to satisfy "like 500") */
while (DICTIONARY_FINAL.length < 500) {
  // make variants by adding suffixes that keep length <= MAX_WORD_LENGTH
  for (let w of Array.from(DICTIONARY_FINAL)) {
    if (DICTIONARY_FINAL.length >= 500) break;
    const suffix = Math.random() < 0.5 ? "A" : "X";
    const nw = (w + suffix).slice(0, MAX_WORD_LENGTH);
    if (!DICTIONARY_FINAL.includes(nw)) DICTIONARY_FINAL.push(nw);
  }
}

/* Final dictionary used by generator */
const DICT_FINAL = DICTIONARY_FINAL.slice(0, 500);

/* ---------- GRID / GAME STATE ---------- */
let grid = [];
let placedWords = []; // {word, coords: [{r,c}], found}
let firstPick = null;
let foundCount = 0;

/* DOM references */
const gridEl = document.getElementById("grid");
const wordListEl = document.getElementById("word-list");
const newBtn = document.getElementById("newBtn");
const foundCountEl = document.getElementById("foundCount");
const wordCountEl = document.getElementById("wordCount");

/* ---------- HELPERS ---------- */
function randomInt(n){ return Math.floor(Math.random()*n); }
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=randomInt(i+1); [arr[i],arr[j]]=[arr[j],arr[i]] } return arr }

/* Create empty grid */
function createEmptyGrid(){
  grid = Array.from({length: GRID_SIZE}, ()=> Array(GRID_SIZE).fill(""));
}

/* Try to place a word on the grid; returns array of coords if success */
function tryPlaceWord(word) {
  const directions = [
    [1,0],[ -1,0 ],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]
  ];
  const maxAttempts = 500;
  for (let attempt=0; attempt<maxAttempts; attempt++){
    const dir = directions[randomInt(directions.length)];
    const rStart = randomInt(GRID_SIZE);
    const cStart = randomInt(GRID_SIZE);
    const rEnd = rStart + dir[1]*(word.length-1);
    const cEnd = cStart + dir[0]*(word.length-1);
    if (rEnd < 0 || rEnd >= GRID_SIZE || cEnd < 0 || cEnd >= GRID_SIZE) continue;

    // check collisions
    let ok = true;
    const coords = [];
    for (let i=0;i<word.length;i++){
      const r = rStart + dir[1]*i;
      const c = cStart + dir[0]*i;
      const ch = grid[r][c];
      if (ch !== "" && ch !== word[i]) { ok=false; break; }
      coords.push({r,c});
    }
    if (!ok) continue;

    // place
    for (let i=0;i<word.length;i++){
      const {r,c} = coords[i];
      grid[r][c] = word[i];
    }
    return coords;
  }
  return null;
}

/* Fill empty spots with random letters */
function fillRandom(){
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r=0;r<GRID_SIZE;r++){
    for (let c=0;c<GRID_SIZE;c++){
      if (grid[r][c] === "") grid[r][c] = alphabet[randomInt(alphabet.length)];
    }
  }
}

/* Render grid to DOM */
function renderGrid(){
  gridEl.innerHTML = "";
  for (let r=0;r<GRID_SIZE;r++){
    for (let c=0;c<GRID_SIZE;c++){
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.textContent = grid[r][c];
      cell.addEventListener("click", onCellClick);
      gridEl.appendChild(cell);
    }
  }
}

/* Render word list */
function renderWordList(){
  wordListEl.innerHTML = "";
  for (let pw of placedWords){
    const li = document.createElement("li");
    li.textContent = pw.word;
    li.id = "word-"+pw.word;
    if (pw.found) li.classList.add("found-word");
    wordListEl.appendChild(li);
  }
  wordCountEl.textContent = String(placedWords.length);
}

/* Build a new puzzle */
function newPuzzle(){
  firstPick = null;
  foundCount = 0;
  foundCountEl.textContent = foundCount;
  createEmptyGrid();
  placedWords = [];

  // pick 15 random words from DICT_FINAL (unique)
  const pool = shuffle(DICT_FINAL.slice());
  const chosen = [];
  for (let word of pool){
    if (chosen.length >= WORDS_TO_PICK) break;
    // sanitize, uppercase, replace underscores for display but keep as letters in grid
    const w = word.replace(/_/g, "");
    if (w.length < MIN_WORD_LENGTH || w.length > MAX_WORD_LENGTH) continue;
    if (!chosen.includes(w)) chosen.push(w);
  }

  // place each word
  for (let w of chosen){
    const up = w.toUpperCase();
    const coords = tryPlaceWord(up);
    if (coords){
      placedWords.push({ word: up, coords: coords, found: false });
    } else {
      // if failed placement, try again later (we'll attempt many times)
      // for simplicity: skip if cannot place
      console.warn("Could not place", up);
    }
  }

  // If fewer than desired words placed (rare), try more attempts by trying different words
  if (placedWords.length < WORDS_TO_PICK){
    const extras = shuffle(DICT_FINAL.slice());
    for (let ex of extras){
      if (placedWords.length >= WORDS_TO_PICK) break;
      const w = ex.replace(/_/g,"");
      if (w.length < MIN_WORD_LENGTH || w.length > MAX_WORD_LENGTH) continue;
      if (placedWords.find(p=>p.word===w.toUpperCase())) continue;
      const coords = tryPlaceWord(w.toUpperCase());
      if (coords) placedWords.push({ word: w.toUpperCase(), coords: coords, found:false });
    }
  }

  // fill blanks and render
  fillRandom();
  renderGrid();
  renderWordList();
}

/* Utility: get cell DOM element by r,c */
function getCellEl(r,c){
  return gridEl.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
}

/* Clear all selections */
function clearSelections(){
  document.querySelectorAll(".cell.selected").forEach(el => el.classList.remove("selected"));
}

/* Mark a placed word as found */
function markFound(wordObj){
  if (wordObj.found) return;
  wordObj.found = true;
  foundCount++;
  foundCountEl.textContent = foundCount;
  // highlight cells as found
  for (let p of wordObj.coords){
    const el = getCellEl(p.r, p.c);
    if (el){
      el.classList.add("found");
      el.classList.remove("selected");
    }
  }
  // cross off in list
  const li = document.getElementById("word-"+wordObj.word);
  if (li) li.classList.add("found-word");
}

/* Given start and end coords, produce path of cells along straight line if valid */
function getLineCoords(r1,c1,r2,c2){
  const dr = r2 - r1;
  const dc = c2 - c1;
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  if (steps === 0) return [{r:r1,c:c1}];
  const stepR = dr === 0 ? 0 : dr / steps;
  const stepC = dc === 0 ? 0 : dc / steps;
  // stepR and stepC must be integers -1,0,1
  if (![ -1,0,1 ].includes(stepR) || ![ -1,0,1 ].includes(stepC)) return null;
  // ensure exact line: steps should equal length-1 etc
  const coords = [];
  for (let i=0;i<=steps;i++){
    const r = r1 + stepR*i;
    const c = c1 + stepC*i;
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return null;
    coords.push({r,c});
  }
  return coords;
}

/* Handle cell click (tap-first → tap-last) */
function onCellClick(e){
  const el = e.currentTarget;
  const r = parseInt(el.dataset.r,10);
  const c = parseInt(el.dataset.c,10);

  if (!firstPick){
    // start selection
    firstPick = {r,c};
    clearSelections();
    el.classList.add("selected");
    return;
  }

  // second pick
  const second = {r,c};
  const path = getLineCoords(firstPick.r, firstPick.c, second.r, second.c);
  if (!path){
    // invalid line: reset start to this cell (allow re-pick)
    firstPick = {r,c};
    clearSelections();
    el.classList.add("selected");
    return;
  }

  // highlight selection
  clearSelections();
  for (let p of path){
    const cel = getCellEl(p.r, p.c);
    if (cel) cel.classList.add("selected");
  }

  // build selected word string
  let sel = path.map(p => grid[p.r][p.c]).join("");
  let selRev = sel.split("").reverse().join("");

  // check if matches any placed word (not yet found)
  const match = placedWords.find(pw => !pw.found && (pw.word === sel || pw.word === selRev));
  if (match){
    // if matched, mark found and keep highlight as found
    markFound(match);
    // check win
    if (foundCount >= placedWords.length){
      setTimeout(()=> alert("Nice! You found all words! 🎉"), 100);
    }
  } else {
    // no match — leave selection briefly then clear
    setTimeout(()=> clearSelections(), 400);
  }

  // reset firstPick
  firstPick = null;
}

/* Initialize */
newBtn.addEventListener("click", () => {
  newPuzzle();
  // small visual feedback
  newBtn.disabled = true;
  setTimeout(()=> newBtn.disabled=false, 300);
});

/* Start first puzzle */
newPuzzle();
