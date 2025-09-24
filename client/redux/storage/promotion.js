// redux/storage/promotion.js

// เริ่มต้นสร้าง action
export const setSlides = (slides) => {
  return {
    type: 'SET_SLIDES',
    payload: slides,
  };
};

// Reducer
const initialState = {
  slides: [],
};

const promotionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SLIDES':
      return {
        ...state,
        slides: action.payload,
      };
    default:
      return state;
  }
};

export default promotionReducer;
