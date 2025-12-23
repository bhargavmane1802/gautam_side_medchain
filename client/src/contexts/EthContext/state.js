export const actions = {
  init: "INIT",
  setRole: "SET_ROLE",
};

export const initialState = {
  artifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  contract: null,
  role: "unknown",
  loading: true, // App starts in a loading state
};

export const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
      return { ...state, ...data };
    case actions.setRole:
      return { ...state, role: data }; // Generic role update
    default:
      throw new Error(`Undefined reducer action type: ${type}`);
  }
};