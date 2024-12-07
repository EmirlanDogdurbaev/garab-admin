import Nav from "../Nav/Nav.jsx";
import Footer from "../Footer/Footer.jsx";
import EndLine from "../Footer/EndLine/EndLine.jsx";

// eslint-disable-next-line react/prop-types
const Layout = ({children}) => {

    return (
        <>
            <header>
                <Nav/>
            </header>
            <main style={{minHeight: "100vh", maxWidth: "1440px", margin:"0 auto",}}>
                {children}
            </main>
            <Footer/>
            <EndLine/>
        </>
    )
}

export default Layout;