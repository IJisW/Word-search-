const GRID_SIZE = 15;
const WORDS_TO_PICK = 15;
const DICT_FINAL = ["CAT","DOG","LION","TIGER","BEAR","WOLF","FOX","DEER","MOOSE","MONKEY","GORILLA","ELEPHANT","ZEBRA","KANGAROO","KOALA","PANDA","SLOTH","RACCOON","ANTHONY","DYLAN","REX","IRA","GLOVING","REMY","APPLE","ORANGE","BANANA","GRAPE","PEACH","CHERRY","MANGO","BERRY","LEMON","LIME","COOKIE","BROWNIE","DONUT","MUFFIN","PANCAKE","WAFFLE"];

let grid = [];
let placedWords = [];
let firstPick = null;
let foundCount = 0;

const gridEl = document.getElementById("grid");
const wordListEl = document.getElementById("word-list");
const newBtn = document.getElementById("newBtn");
const foundCountEl = document.getElementById("foundCount");
const wordCountEl = document.getElementById("wordCount");

function randomInt(n){ return Math.floor(Math.random()*n); }
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=randomInt(i+1); [arr[i],arr[j]]=[arr[j],arr[i]] } return arr }

function createEmptyGrid(){ grid = Array.from({length:GRID_SIZE},()=> Array(GRID_SIZE).fill("")); }

function tryPlaceWord(word){
  const directions=[[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
  for(let attempt=0; attempt<500; attempt++){
    const dir=directions[randomInt(directions.length)];
    const rStart=randomInt(GRID_SIZE);
    const cStart=randomInt(GRID_SIZE);
    const rEnd=rStart+dir[0]*(word.length-1);
    const cEnd=cStart+dir[1]*(word.length-1);
    if(rEnd<0||rEnd>=GRID_SIZE||cEnd<0||cEnd>=GRID_SIZE) continue;
    let ok=true;
    const coords=[];
    for(let i=0;i<word.length;i++){
      const r=rStart+dir[0]*i;
      const c=cStart+dir[1]*i;
      if(grid[r][c]!="" && grid[r][c]!=word[i]){ ok=false; break; }
      coords.push({r,c});
    }
    if(ok){
      for(let p of coords) grid[p.r][p.c]=word[coords.indexOf(p)];
      return coords;
    }
  }
  return null;
}

function fillRandom(){
  const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(let r=0;r<GRID_SIZE;r++){
    for(let c=0;c<GRID_SIZE;c++){
      if(grid[r][c]=="") grid[r][c]=alphabet[randomInt(alphabet.length)];
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
      cell.addEventListener("click",onCellClick);
    }
  }
}

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

function getCellEl(r,c){ return gridEl.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`); }
function clearSelections(){ document.querySelectorAll(".cell.selected").forEach(el=>el.classList.remove("selected")); }
function markFound(wordObj){
  if(wordObj.found) return;
  wordObj.found=true;
  foundCount++;
  foundCountEl.textContent=foundCount;
  for(let p of wordObj.coords){
    const el=getCellEl(p.r,p.c);
    if(el){ el.classList.add("found"); el.classList.remove("selected"); }
  }
  const li=document.getElementById("word-"+wordObj.word);
  if(li) li.classList.add("found-word");
}

function getLineCoords(r1,c1,r2,c2){
  const dr=r2-r1;
  const dc=c2-c1;
  const steps=Math.max(Math.abs(dr),Math.abs(dc));
  if(steps===0) return [{r:r1,c:c1}];
  const stepR=dr/steps;
  const stepC=dc/steps;
  if(!Number.isInteger(stepR) || !Number.isInteger(stepC)) return null;
  const coords=[];
  for(let i=0;i<=steps;i++){ coords.push({r:r1+stepR*i,c:c1+stepC*i}); }
  return coords;
}

function onCellClick(e){
  const el=e.currentTarget;
  const r=parseInt(el.dataset.r,10);
  const c=parseInt(el.dataset.c,10);
  if(!firstPick){ firstPick={r,c}; clearSelections(); el.classList.add("selected"); return; }
  const second={r,c};
  const path=getLineCoords(firstPick.r,firstPick.c,second.r,second.c);
  if(!path){ firstPick={r,c}; clearSelections(); el.classList.add("selected"); return; }
  clearSelections();
  for(let p of path){ const cel=getCellEl(p.r,p.c); if(cel) cel.classList.add("selected"); }
  let sel=path.map(p=>grid[p.r][p.c]).join("");
  let selRev=sel.split("").reverse().join("");
  const match=placedWords.find(pw=>!pw.found&&(pw.word===sel||pw.word===selRev));
  if(match){ markFound(match); if(foundCount>=placedWords.length) setTimeout(()=>alert("Nice! You found all words! 🎉"),100); }
  else setTimeout(()=>clearSelections(),400);
  firstPick=null;
}

function newPuzzle(){
  firstPick = null;
  foundCount = 0;
  foundCountEl.textContent = foundCount;
  createEmptyGrid();
  placedWords = [];

  const pool = shuffle(DICT_FINAL.filter(w=>w.length <= GRID_SIZE)); // only words that fit
  let attempts = 0;
  const maxAttempts = 5000;

  while(placedWords.length < WORDS_TO_PICK && attempts < maxAttempts){
    if(pool.length === 0) break;
    const idx = randomInt(pool.length);
    const word = pool[idx].toUpperCase();
    const coords = tryPlaceWord(word);
    if(coords){
      placedWords.push({word, coords, found:false});
      pool.splice(idx,1); // remove used word
    }
    attempts++;
  }

  fillRandom();
  renderGrid();
  renderWordList();
}

newBtn.addEventListener("click",()=>{ newPuzzle(); newBtn.disabled=true; setTimeout(()=>newBtn.disabled=false,300); });
newPuzzle();
