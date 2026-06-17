import { useContext, useEffect, useReducer } from "react";
import { createContext } from "react";
import { cartReducer } from "../reducer/cartReducer";

const CART_STORAGE_KEY = "cartList";

const initialState = {
    cartList: [],
    total: 0
}

const CartContext = createContext(initialState);   // Think of this as creating a backpack that holds your cart data.

const calculateTotal = (products = []) => {
    return products.reduce((sum, product) => sum + Number(product.price || 0), 0);
};

const getInitialState = () => {
    if (typeof window === "undefined") {
        return initialState;
    }

    try {
        const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];
        const cartList = Array.isArray(parsedCart) ? parsedCart : [];

        return {
            cartList,
            total: calculateTotal(cartList)
        };
    } catch (error) {
        return initialState;
    }
};

export const CartProvider = ({children}) => {
    const [state, dispatch] = useReducer(cartReducer, initialState, getInitialState);

    useEffect(() => {
        try {
            window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cartList));
        } catch (error) {
            // Ignore storage failures so cart actions still work in memory.
        }
    }, [state.cartList]);

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
        const total = calculateTotal(products);

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
