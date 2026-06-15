import { useContext, useReducer } from "react";
import { createContext } from "react";
import { cartReducer } from "../reducer/cartReducer";

const initialState = {
    cartList: [],
    total: 0
}

const CartContext = createContext(initialState);   // Think of this as creating a backpack that holds your cart data.

export const CartProvider = ({children}) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // state = the current cart (cartList and total)
    // dispatch = function you call to change the cart
    // cartReducer = a separate file that says how to update the cart

    const addToCart = (product) => {
        const updatedCartList = state.cartList.concat(product);
        updateTotal(updatedCartList);

        dispatch({
            type: "ADD_TO_CART",
            payload: {
                products: updatedCartList
            }
        })
    }

    const removeFromCart = (product) => {
        const updatedCartList = state.cartList.filter(current => current.id !== product.id);
        updateTotal(updatedCartList);

        dispatch({
            type: "REMOVE_FROM_CART",
            payload: {
                products: updatedCartList
            }
        })
    }

    const updateTotal = (products) => {
        let total = 0;
        products.forEach(product => total = total + product.price);

        dispatch({
            type: "UPDATE_TOTAL",
            payload: {
                total
            }
        })
    }

    const value = {
        total: state.total,
        cartList: state.cartList,
        addToCart,
        removeFromCart
    };


    // Any component that uses useCart() will have access to:
    // cartList (all items)
    // total (final price)
    // addToCart() function
    // removeFromCart() function

    return (
        <CartContext.Provider value={value}>
            {children}                         
        </CartContext.Provider>
    );
    // All components inside me can access the cart.
}

export const useCart = () => {
    const context = useContext(CartContext);
    return context;
}