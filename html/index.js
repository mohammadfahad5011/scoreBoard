
const initialState = [{ id: 1, name: "Match 1", score: 0 }];

function matchesReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_MATCH":
      return [
        ...state,
        { id: state.length + 1, name: `Match ${state.length + 1}`, score: 0 },
      ];
    case "DELETE_MATCH":
      return state.filter((match) => match.id !== action.payload);
    case "INCREMENT_SCORE":
      return state.map((match) =>
        match.id === action.payload.id
          ? { ...match, score: match.score + action.payload.amount }
          : match
      );

    case "DECREMENT_SCORE":
      return state.map((match) =>
        match.id === action.payload.id
          ? {
              ...match,
              score: Math.max(match.score - action.payload.amount, 0),
            }
          : match
      );
    case "RESET_SCORES":
      return state.map((match) => ({ ...match, score: 0 }));
    default:
      return state;
  }
}
const store = Redux.createStore(matchesReducer);

function renderMatches() {
  const matches = store.getState();

  const matchesHtml = matches
    .map(
      (match) =>
        `<div class="match">
            <div class="wrapper">
              <button class="lws-delete" onclick="deleteMatch(${match.id})">
                <img src="./image/delete.svg" alt="" />
              </button>
              <h3 class="lws-matchName">${match.name}</h3>
            </div>
            <div class="inc-dec">
              <form class="incrementForm" onsubmit="return false;">
                <h4>Increment</h4>
                <input class="lws-increment" type="number" value="" onchange="incrementScore(${match.id}, this.value)" />
              </form>
              <form class="decrementForm" onsubmit="return false;">
                <h4>Decrement</h4>
                <input class="lws-decrement" type="number" value="" onchange="decrementScore(${match.id}, this.value)" />
              </form>
            </div>
            <div class="numbers">
              <h2 class="lws-singleResult">${match.score}</h2>
            </div>
          </div>`
    )
    .join("");

  const matchesContainer = document.querySelector(".all-matches");

  if (matchesContainer) {
    matchesContainer.innerHTML = matchesHtml;
  }
}

//get state

let numberOfMatches;
store.subscribe(() => {
  numberOfMatches = store.getState().length;
});

//Add matchs and added validation
const addMatchButton = document.querySelector(".lws-addMatch");
addMatchButton.addEventListener("click", handleClick);

function handleClick() {
  store.dispatch({ type: "ADD_MATCH" });
  if (numberOfMatches >= 10) {
    addMatchButton.removeEventListener("click", handleClick);
  }
}

function deleteMatch(matchId) {
  store.dispatch({ type: "DELETE_MATCH", payload: matchId });
}

const resetButton = document.querySelector(".lws-reset");
resetButton.addEventListener("click", () => {
  store.dispatch({ type: "RESET_SCORES" });
});

function incrementScore(matchId, value) {
  store.dispatch({
    type: "INCREMENT_SCORE",
    payload: { id: matchId, amount: parseInt(value) },
  });
}

function decrementScore(matchId, value) {
  store.dispatch({
    type: "DECREMENT_SCORE",
    payload: { id: matchId, amount: parseInt(value) },
  });
}

renderMatches();
store.subscribe(renderMatches);
