const grid = document.getElementById("grid");
const refreshBtn = document.getElementById("refreshBtn");
const wordListEl = document.getElementById("wordList");

// 15x15 grid
const GRID_SIZE = 15;

// Words (mostly animals)
const WORDS = ["LION","TIGER","BEAR","WOLF","FOX","DOG","CAT","EAGLE","SHARK","WHALE",
               "ZEBRA","GIRAFFE","RHINO","HIPPO","PANDA","OWL","DEER","SNAKE","FROG",
               "MONKEY","ANT","BEE","BAT","COW","PIG","SHEEP","GOAT","DUCK","HEN",
               "FISH","HORSE","CAMEL","LEOPARD","PANTHER","CROCODILE","ALLIGATOR",
               "FALCON","PARROT","SEAL","OTTER","RABBIT","SQUIRREL","MOUSE","RAT",
               "LOBSTER","CRAB","TURTLE","KOALA","KANGAROO","WHIPPET"];

// grid array to store letters
let gridArray = [];

// words with positions
let placedWords = [];

function createEmptyGrid() {
  gridArray = [];
  for(let r=0;r<GRID_SIZE;r++){
    const row = [];
    for(let c=0;c<GRID_SIZE;c++){
      row.push('');
    }
    gridArray.push(row);
  }
}

function randomInt(min,max){return Math.floor(Math.random()*(max-min+1)+min);}

// Directions: right, down, diagonal down-right
const DIRECTIONS = [
  {r:0,c:1}, // right
  {r:1,c:0}, // down
  {r:1,c:1}  // diagonal
];

function placeWord(word){
  let attempts = 0;
  while(attempts<100){
    const dir = DIRECTIONS[randomInt(0,DIRECTIONS.length-1)];
    const startRow = randomInt(0, GRID_SIZE-1);
    const startCol = randomInt(0, GRID_SIZE-1);
    let r=startRow,c=startCol;
    let fits=true;

    for(let i=0;i<word.length;i++){
      if(r<0 || r>=GRID_SIZE || c<0 || c>=GRID_SIZE) {fits=false; break;}
      if(gridArray[r][c]!=='' && gridArray[r][c]!==word[i]) {fits=false; break;}
      r+=dir.r; c+=dir.c;
    }

    if(fits){
      r=startRow; c=startCol;
      const positions=[];
      for(let i=0;i<word.length;i++){
        gridArray[r][c]=word[i];
        positions.push({r,c});
        r+=dir.r; c+=dir.c;
      }
      placedWords.push({word, positions});
      return true;
    }
    attempts++;
  }
  return false;
}

function fillEmptyGrid(){
  const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(let r=0;r<GRID_SIZE;r++){
    for(let c=0;c<GRID_SIZE;c++){
      if(gridArray[r][c]==='') gridArray[r][c]=letters[randomInt(0,letters.length-1)];
    }
  }
}

function renderGrid(){
  grid.innerHTML='';
  for(let r=0;r<GRID_SIZE;r++){
    for(let c=0;c<GRID_SIZE;c++){
      const cell=document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row=r;
      cell.dataset.col=c;
      cell.textContent=gridArray[r][c];
      cell.addEventListener('click',()=>onCellClick(cell,r,c));
      grid.appendChild(cell);
    }
  }
}

function renderWordList(){
  wordListEl.innerHTML='';
  for(const w of placedWords){
    const li=document.createElement('li');
    li.textContent=w.word;
    wordListEl.appendChild(li);
  }
}

function onCellClick(cell,r,c){
  // check if cell is part of a word
  for(const w of placedWords){
    for(const pos of w.positions){
      if(pos.r===r && pos.c===c){
        // cross off all letters in that word
        w.positions.forEach(p=>{
          const idx=p.r*GRID_SIZE+p.c;
          grid.children[idx].classList.add('found');
        });
        // cross off in word list
        [...wordListEl.children].forEach(li=>{
          if(li.textContent===w.word) li.classList.add('found-word');
        });
        return;
      }
    }
  }
  // optional: allow crossing single letters not part of words
  cell.classList.toggle('found');
}

function generateGrid(){
  createEmptyGrid();
  placedWords=[];
  const selectedWords = [];
  while(selectedWords.length<15){
    const w = WORDS[randomInt(0,WORDS.length-1)];
    if(!selectedWords.includes(w)) selectedWords.push(w);
  }
  selectedWords.forEach(w=>placeWord(w));
  fillEmptyGrid();
  renderGrid();
  renderWordList();
}

refreshBtn.addEventListener('click', generateGrid);

generateGrid();
