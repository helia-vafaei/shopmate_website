import { Routes, Route } from "react-router-dom";
import { Cart, Home } from "../pages/index";




export const AllRoutes = () => {

    return (
        <div>
            <Routes>
                <Route path="" element={<Home/>}/>
                <Route path="/cart" element={<Cart/>}/>
            </Routes>
        </div>
    )
}
