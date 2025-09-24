// Action
export const setRanks = (ranks) => {
    return {
      type: 'SET_RANKS',
      payload: ranks,
    };
  };
  
  // Reducer
  const initialState = {
    ranks: [],
  };
  
  const promotionReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_RANKS':
        return {
          ...state,
          ranks: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default promotionReducer;
  