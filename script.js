function newPuzzle(){
  firstPick = null;
  foundCount = 0;
  foundCountEl.textContent = foundCount;
  createEmptyGrid();
  placedWords = [];

  const pool = shuffle(DICT_FINAL.slice());
  let chosen = [];
  let attempts = 0;
  const maxAttempts = 10000; // allow plenty of retries

  // Keep trying until we place WORDS_TO_PICK words or run out of attempts
  while(chosen.length < WORDS_TO_PICK && attempts < maxAttempts){
    if(pool.length === 0) break; // no words left
    const idx = randomInt(pool.length); // pick a random word
    const word = pool[idx].toUpperCase();
    const coords = tryPlaceWord(word);
    if(coords){
      chosen.push({word, coords, found:false});
      pool.splice(idx,1); // remove used word so we don't repeat
    }
    attempts++;
  }

  placedWords = chosen;
  fillRandom();
  renderGrid();
  renderWordList();
}
