import Nav from "../Nav/Nav.jsx";

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

        </>
    )
}

export default Layout;