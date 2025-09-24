// เริ่มต้นสร้าง action
export const setNews = (newsList) => {
  return {
    type: 'SET_NEWS',
    payload: newsList,
  };
};

// Reducer
const initialState = {
  news: [],
};

const newsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NEWS':
      return {
        ...state,
        news: action.payload,
      };
    default:
      return state;
  }
};

export default newsReducer;
