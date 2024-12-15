import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import "./i18n";
import AllProducts from "./components/AllProducts/AllProducts.jsx";
import ModifySpecialOffer from "./components/AllDiscounts/ModifySpecialOffer/ModifySpecialOffer.jsx";
import ChangeCollection from "./components/AllCollections/ChangeCollection/ChangeCollection.jsx";
import AddCategory from "./components/AllCategory/AddCategory/AddCategory.jsx";
import AllVacancy from "./components/AllVacancy/AllVacancy.jsx";
import AllCollections from "./components/AllCollections/AllCollections.jsx";
import Login from "./components/Auth/Login/Login.jsx";
import AddCollection from "./components/AllCollections/AddCollection/AddCollection.jsx";
import CreateVacancy from "./components/AllVacancy/CreateVacancy/CreateVacancy.jsx";
import CreateBrand from "./components/AllBrands/CreateBrand.jsx";
import UpdateBrand from "./components/AllBrands/UpdateBrands/UpdateBrands.jsx";
import CreateProduct from "./components/AllProducts/CreateProduct/CreateProduct.jsx";
import UpdateProducts from "./components/AllProducts/UpdateProducts/UpdateProducts.jsx";
import AllCategory from "./components/AllCategory/AllCategory.jsx";
import EditCategory from "./components/AllCategory/EditCategory/EditCategory.jsx";
import AllBrands from "./components/AllBrands/AllBrands.jsx";
import EditVacancy from "./components/AllVacancy/EditVacancy/EditVacancy.jsx";
import AllDiscounts from "./components/AllDiscounts/AllDiscounts.jsx";
import AllReviews from "./components/AllReviews/AllReviews.jsx";

const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp > Date.now() / 1000;
    } catch {
        return false;
    }
};

const ProtectedRoute = ({ children }) => {
    const auth = isAuthenticated();
    return auth ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated() ? (
                        <Navigate to="/admin" />
                    ) : (
                        <Login />
                    )
                }
            />

            <Route
                path="/admin/*"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Routes>
                                <Route path="/all-products" element={<AllProducts />} />
                                <Route path="/add-product" element={<CreateProduct />} />
                                <Route path="/update-product/:id" element={<UpdateProducts />} />
                                <Route path="/all-collections" element={<AllCollections />} />
                                <Route path="/add-collection" element={<AddCollection />} />
                                <Route path="/change-collections/:id" element={<ChangeCollection />} />
                                <Route path="/discount" element={<ModifySpecialOffer />} />
                                <Route path="/all-discount" element={<AllDiscounts />} />
                                <Route path="/add-category" element={<AddCategory />} />
                                <Route path="/all-category" element={<AllCategory />} />
                                <Route path="/update-category/:id" element={<EditCategory />} />
                                <Route path="/all-vacancies" element={<AllVacancy />} />
                                <Route path="/change-vacancy/:id" element={<EditVacancy />} />
                                <Route path="/create-vacancy" element={<CreateVacancy />} />
                                <Route path="/create-brand" element={<CreateBrand />} />
                                <Route path="/update-brand/:id" element={<UpdateBrand />} />
                                <Route path="/brands" element={<AllBrands />} />
                                <Route path="/all-reviews" element={<AllReviews />} />
                                <Route path="*" element={<AllProducts />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default App;
