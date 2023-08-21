import { Breadcrumbs, Link, Typography } from "@mui/material"
import { withRouter } from "next/router"

const Breadcrumb = props => {
    const {
        history, 
        location : {pathname}
    } = props;

    const pathnames = pathname.split("/").filter(x => x);
    return (
        <Breadcrumbs aria-label="breadcrumb">
            <Link onClick={() => history.push("/")}></Link>
            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                return <Link onClick={() => history.push(routeTo)}>{name}</Link>
            })}
        </Breadcrumbs>
    )
}

export default withRouter(Breadcrumb);