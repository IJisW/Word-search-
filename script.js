/* ---------- CONFIG ---------- */
const GRID_SIZE = 15;
const WORDS_TO_PICK = 15;
const MIN_WORD_LENGTH = 3;
const MAX_WORD_LENGTH = 15;

/* ---------- DICTIONARY ---------- */
const DICT_FINAL = [
  "CAT","DOG","LION","TIGER","BEAR","WOLF","FOX","DEER","ELK","MOOSE",
  "COYOTE","JAGUAR","LEOPARD","PUMA","CHEETAH","HYENA","OTTER","PANDA","SLOTH","RACCOON",
  "MONKEY","GORILLA","CHIMPANZEE","ORANGUTAN","LEMUR","BISON","BUFFALO","RHINO","HIPPO","ELEPHANT",
  "ZEBRA","GIRAFFE","KANGAROO","KOALA","WOMBAT","PLATYPUS","ANTELOPE","GAZELLE","CARIBOU","HARE",
  "RABBIT","FERRET","WEASEL","BADGER","MINK","SEAL","SEA_LION","WHALE","DOLPHIN","PORPOISE",
  "ORCA","MANATEE","MARLIN","TUNA","SALMON","TROUT","BASS","COD","ANCHOVY","MACKEREL",
  /* add more to reach ~500 words */
];

/* ---------- GRID / STATE ---------- */
let grid = [];
let placedWords = []; // {word, coords: [{r,c}], found}
let firstPick = null;
let foundCount = 0;

/* DOM */
const gridEl = document.getElementById("grid");
const wordListEl = document.getElementById("word-list");
const newBtn = document.getElementById("newBtn");
const foundCountEl = document.getElementById("foundCount");
const wordCountEl = document.getElementById("wordCount");

/* ---------- HELPERS ---------- */
function randomInt(n){ return Math.floor(Math.random()*n); }
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=randomInt(i+1); [arr[i],arr[j]]=[arr[j],arr[i]] } return arr }

function createEmptyGrid(){
  grid = Array.from({length: GRID_SIZE}, ()=> Array(GRID_SIZE).fill(""));
}

function tryPlaceWord(word){
  const directions = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  const maxAttempts = 500;
  for (let attempt=0; attempt<maxAttempts; attempt++){
    const dir = directions[randomInt(directions.length)];
    const rStart = randomInt(GRID_SIZE);
    const cStart = randomInt(GRID_SIZE);
    const rEnd = rStart + dir[1]*(word.length-1);
    const cEnd = cStart + dir[0]*(word.length-1);
    if (rEnd<0 || rEnd>=GRID_SIZE || cEnd<0 || cEnd>=GRID_SIZE) continue;

    let ok=true;
    const coords=[];
    for(let i=0;i<word.length;i++){
      const r=rStart+dir[1]*i;
      const c=cStart+dir[0]*i;
      if(grid[r][c]!=="" && grid[r][c]!==word[i]){ok=false;break;}
      coords.push({r,c});
    }
    if(!ok) continue;

    for(let i=0;i<word.length;i++){
      const {r,c}=coords[i];
      grid[r][c]=word[i];
    }
    return coords;
  }
  return null;
}

function fillRandom(){
  const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(let r=0;r<GRID_SIZE;r++){
    for(let c=0;c<GRID_SIZE;c++){
      if(grid[r][c]==="") grid[r][c]=alphabet[randomInt(alphabet.length)];
    }
  }
}

function renderGrid(){
  gridEl.innerHTML="";
  for(let r=0;r<GRID_SIZE;r++){
    for(let c=0;c<GRID_SIZE;c++){
      const cell=document.createElement("div");
      cell.className="cell";
      cell.dataset.r=r;
      cell.dataset.c=c;
      cell.textContent=grid[r][c];
      gridEl.appendChild(cell);
    }
  }
}

/* Render word list */
function renderWordList(){
  wordListEl.innerHTML="";
  for(let pw of placedWords){
    const li=document.createElement("li");
    li.textContent=pw.word;
    li.id="word-"+pw.word;
    if(pw.found) li.classList.add("found-word");
    wordListEl.appendChild(li);
  }
  wordCountEl.textContent=placedWords.length;
}

/* Build a new puzzle */
function newPuzzle(){
  firstPick=null;
  foundCount=0;
  foundCountEl.textContent=foundCount;
  createEmptyGrid();
  placedWords=[];

  const pool=shuffle(DICT_FINAL.slice());
  const chosen=[];
  for(let word of pool){
    if(chosen.length>=WORDS_TO_PICK) break;
    const w=word.replace(/_/g,"");
    if(w.length<MIN_WORD_LENGTH || w.length>MAX_WORD_LENGTH) continue;
    if(!chosen.includes(w)) chosen.push(w);
  }

  for(let w of chosen){
    const up=w.toUpperCase();
    const coords=tryPlaceWord(up);
    if(coords){
      placedWords.push({word:up,coords:coords,found:false});
    }
  }

  fillRandom();
  renderGrid();
  renderWordList();
}

/* --------- SELECTION LOGIC --------- */
function getCellEl(r,c){return gridEl.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);}
function clearSelections(){document.querySelectorAll(".cell.selected").forEach(el=>el.classList.remove("selected"));}
function markFound(wordObj){
  if(wordObj.found) return;
  wordObj.found=true;
  foundCount++;
  foundCountEl.textContent=foundCount;
  for(let p of wordObj.coords){
    const el=getCellEl(p.r,p.c);
    if(el){el.classList.add("found");el.classList.remove("selected");}
  }
  const li=document.getElementById("word-"+wordObj.word);
  if(li) li.classList.add("found-word");
}

function getLineCoords(r1,c1,r2,c2){
  const dr=r2-r1;
  const dc=c2-c1;
  const steps=Math.max(Math.abs(dr),Math.abs(dc));
  if(steps===0) return [{r:r1,c:c1}];
  const stepR=dr===0?0:dr/steps;
  const stepC=dc===0?0:dc/steps;
  if(![-1,0,1].includes(stepR)||![-1,0,1].includes(stepC)) return null;
  const coords=[];
  for(let i=0;i<=steps;i++){
    const r=r1+stepR*i;
    const c=c1+stepC*i;
    if(r<0||r>=GRID_SIZE||c<0||c>=GRID_SIZE) return null;
    coords.push({r,c});
  }
  return coords;
}

/* Handle tap / click */
function onCellClick(e){
  const el=e.currentTarget;
  const r=parseInt(el.dataset.r,10);
  const c=parseInt(el.dataset.c,10);
  if(!firstPick){
    firstPick={r,c};
    clearSelections();
    el.classList.add("selected");
    return;
  }
  const second={r,c};
  const path=getLineCoords(firstPick.r,firstPick.c,second.r,second.c);
  if(!path){firstPick={r,c};clearSelections();el.classList.add("selected");return;}
  clearSelections();
  for(let p of path){const cel=getCellEl(p.r,p.c);if(cel) cel.classList.add("selected");}
  let sel=path.map(p=>grid[p.r][p.c]).join("");
  let selRev=sel.split("").reverse().join("");
  const match=placedWords.find(pw=>!pw.found && (pw.word===sel || pw.word===selRev));
  if(match){markFound(match);if(foundCount>=placedWords.length)setTimeout(()=>alert("Nice! You found all words! 🎉"),100);}
  else setTimeout(()=>clearSelections(),300);
  firstPick=null;
}

/* Add event delegation for touch-friendly cells */
gridEl.addEventListener("click",onCellClick);

/* New puzzle button */
newBtn.addEventListener("click",()=>{newPuzzle();newBtn.disabled=true;setTimeout(()=>newBtn.disabled=false,300);});

/* Start first puzzle */
newPuzzle();
