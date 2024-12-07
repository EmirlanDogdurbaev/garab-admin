import {Link} from "react-router-dom";

// eslint-disable-next-line react/prop-types
const NavItem = ({children, to}) => {
    return (
        <li>
            <Link to={to}>{children}</Link>
        </li>
    )
}

export default NavItem