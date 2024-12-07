import classes from './Homepage.module.scss'
import Header from "../../components/Header/Header.jsx";
import Counter from "../../components/Counter/Counter.jsx";
import CompanyGoalHome from "../../components/CompanyGoalHome/CompanyGoalHome.jsx";
import SpecialProductCard from "../../components/AllDiscounts/SpecialProductCard/SpecialProductCard.jsx";
import SwitchSection from "../../components/SwitchSection/SwitchSection.jsx";
import Catalog from "../../components/Catalog/Catalog.jsx";
import Reviews from "../../components/Reviews/Reviews.jsx";
import Brands from "../../components/AllBrands/Brands/Brands.jsx";

const Homepage = () => {


    return (
        <main className={classes.HomePage}>
            <Header/>
            <Counter/>
            <CompanyGoalHome/>
            <SpecialProductCard/>
            <SwitchSection/>
            <Catalog/>
            <Reviews/>
            <Brands/>
        </main>
    )
}

export default Homepage