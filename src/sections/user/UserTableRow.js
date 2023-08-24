import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Details from "@mui/icons-material/Details";
import {Button, IconButton, TableCell, TableRow} from "@mui/material"

export default function UserTableRow({row, num, onShowImage, onDelete, onEdit}){
    let {email, admins} = row;
    let {adminName, adminNum, adminLevel,role} =  admins;
    return (
        <>
        
            <TableRow>
                <TableCell width={'25px'}>
                    {num}
                </TableCell>
                <TableCell>
                    {adminName}
                </TableCell>
                <TableCell>
                    {email}
                </TableCell>
                <TableCell>
                    {adminNum}
                </TableCell>
                <TableCell>
                    {role?.roleName}
                </TableCell>
                <TableCell align="center">
                    <IconButton onClick={onEdit} sx={{marginX:'0.5em'}} variant="contained" color="warning" >
                        <Edit></Edit>
                    </IconButton>
                    {/* {
                        adminLevel == 1 ? '' : (
                            <IconButton onClick={onDelete} sx={{marginX:'0.5em'}} variant="contained" color="error" >
                                <Delete></Delete>
                            </IconButton>
                        )
                    } */}
                </TableCell>
            </TableRow>
        </>
    )
}