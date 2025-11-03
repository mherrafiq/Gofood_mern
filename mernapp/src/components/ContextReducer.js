import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      let existingItemIndex = state.findIndex(
        item => item.name === action.name && item.size === action.size
      );
      if (existingItemIndex !== -1) {
        let updatedCart = [...state];
        let existingItem = updatedCart[existingItemIndex];
        updatedCart[existingItemIndex] = {
          ...existingItem,
          qty: existingItem.qty + action.qty,
          price: existingItem.price + action.price
        };
        return updatedCart;
      } else {
        return [...state, {
          id: action.id,
          name: action.name,
          qty: action.qty,
          size: action.size,
          price: action.price,
          img: action.img
        }];
      }

    case "REMOVE":
      let newArr = [...state];
      newArr.splice(action.index, 1);
      return newArr;

    case "CLEAR":
    case "DROP":
      return [];

    case "UPDATE":
      let updatedArray = [...state];
      updatedArray[action.index] = {
        ...updatedArray[action.index],
        qty: action.qty,
        price: action.price
      };
      return updatedArray;

    default:
      console.log("Error in Reducer");
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, [], () => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    if (state.length > 0) {
      localStorage.setItem('cart', JSON.stringify(state));
    } else {
      localStorage.removeItem('cart');
    }
  }, [state]);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
