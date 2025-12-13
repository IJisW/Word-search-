const GRID_SIZE = 15;
const WORDS_TO_PICK = 15;
const DICT_FINAL = ["CAT","DOG","LION","TIGER","BEAR","WOLF","FOX","DEER","MOOSE","MONKEY","GORILLA","ELEPHANT","ZEBRA","KANGAROO","KOALA","PANDA","SLOTH","RACCOON","ANTHONY","DYLAN","REX","IRA","GLOVING","REMY","APPLE","ORANGE","BANANA","GRAPE","PEACH","CHERRY","MANGO","BERRY","LEMON","LIME","COOKIE","BROWNIE","DONUT","MUFFIN","PANCAKE","WAFFLE"];

let grid = [];
let placedWords = [];

function randomInt(n){ return Math.floor(Math.random()*n); }
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=randomInt(i+1); [arr[i],arr[j]]=[arr[j],arr[i]] } return arr }

function createEmptyGrid(){ grid = Array.from({length:GRID_SIZE},()=> Array(GRID_SIZE).fill("")); }

function tryPlaceWord(word){
  const directions=[[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
  for(let attempt=0;attempt<500;attempt++){
    const dir=directions[randomInt(directions.length)];
    const r=randomInt(GRID_SIZE);
    const c=randomInt(GRID_SIZE);
    const rEnd=r+dir[0]*(word.length-1);
    const cEnd=c+dir[1]*(word.length-1);
    if(rEnd<0||rEnd>=GRID_SIZE||cEnd<0||cEnd>=GRID_SIZE) continue;
    let ok=true;
    const coords=[];
    for(let i=0;i<word.length;i++){
      const rr=r+dir[0]*i;
      const cc=c+dir[1]*i;
      if(grid[rr][cc]!="" && grid[rr][cc]!=word[i]){ ok=false; break; }
      coords.push({r:rr,c:cc});
    }
    if(ok){
      for(let p of coords) grid[p.r][p.c]=word[p.r==null ? 0 : 0];
      return coords;
    }
  }
  return null;
}

function fillRandom(){
  const alpha="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(let r=0;r<GRID_SIZE;r++){
    for(let c=0;c<GRID_SIZE;c++){
      if(grid[r][c]=="") grid[r][c]=alpha[randomInt(alpha.length)];
    }
  }
}

function newPuzzle(){
  createEmptyGrid();
  placedWords=[];
  const pool=shuffle(DICT_FINAL.filter(w=>w.length<=GRID_SIZE));
  let i=0;
  while(placedWords.length<WORDS_TO_PICK && i<pool.length){
    const word=pool[i];
    const coords=tryPlaceWord(word);
    if(coords) placedWords.push({word,coords,found:false});
    i++;
  }
  fillRandom();
  console.log(grid);
  console.log("Words:", placedWords.map(w=>w.word));
}

newPuzzle();
