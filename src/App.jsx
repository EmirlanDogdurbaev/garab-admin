import './App.css';
import {Navigate, Route, Routes} from 'react-router-dom';
import ErrorPage from './Pages/Errorpage/Errorpage';
import Layout from "./components/Layout/Layout.jsx";
import './i18n';
import AdminPage from "./Pages/AdminPage/AdminPage.jsx";
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
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    } catch {
        return false;
    }
};

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({isAuthenticated, children}) => {
    return isAuthenticated ? children : <Navigate to="/"/>;
};

const App = () => {
    const isAdmin = isAuthenticated();

    return (
        <Layout>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="*" element={<Login/>}/>
                {isAdmin && (
                    <>
                        <Route path="/admin/" element={
                            <ProtectedRoute isAuthenticated={isAdmin}>
                                <AdminPage/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/admin/all-products" element={<AllProducts/>}/>
                        <Route path="/admin/add-product" element={<CreateProduct/>}/>
                        <Route path="/admin/update-product/:id" element={<UpdateProducts/>}/>
                        <Route path="/admin/all-collections" element={<AllCollections/>}/>
                        <Route path="/admin/add-collection" element={<AddCollection/>}/>
                        <Route path="/admin/change-collections/:id" element={<ChangeCollection/>}/>
                        <Route path="/admin/discount" element={<ModifySpecialOffer/>}/>
                        <Route path="/admin/all-discount" element={<AllDiscounts/>}/>
                        <Route path="/admin/add-category" element={<AddCategory/>}/>
                        <Route path="/admin/all-category" element={<AllCategory/>}/>
                        <Route path="/admin/update-category/:id" element={<EditCategory/>}/>
                        <Route path="/admin/all-vacancies" element={<AllVacancy/>}/>
                        <Route path="/admin/change-vacancy/:id" element={<EditVacancy/>}/>
                        <Route path="/admin/create-vacancy" element={<CreateVacancy/>}/>
                        <Route path="/admin/create-brand" element={<CreateBrand/>}/>
                        <Route path="/admin/update-brand/:id" element={<UpdateBrand/>}/>
                        <Route path="/admin/brands" element={<AllBrands/>}/>
                        <Route path="/admin/all-reviews" element={<AllReviews/>}/>
                    </>
                )}
            </Routes>
        </Layout>
    );
};

export default App;
