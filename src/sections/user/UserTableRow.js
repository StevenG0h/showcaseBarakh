import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Details from "@mui/icons-material/Details";
import {Button, IconButton, TableCell, TableRow} from "@mui/material"
import {fDate} from '../../helper/date';
export default function UserTableRow({row, num, onShowImage, onDelete, onEdit}){
    let {email, admins,created_at } = row;
    let {adminName, adminNum, adminLevel,role,unit_usaha, isActive, deleted_at} =  admins;
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
                    {adminNum}
                </TableCell>
                <TableCell>
                    {unit_usaha?.usahaName}
                </TableCell>
                <TableCell>
                    {role?.roleName}
                </TableCell>
                {
                    isActive != 0 ? (
                        <TableCell>
                        {fDate(created_at)}
                        </TableCell>
                    ) : (
                        <TableCell>
                            {fDate(deleted_at)}
                        </TableCell>
                    )
                }
                
                {
                    isActive != 1 ?
                    '':
                     (
                        <TableCell align="center">
                    <IconButton onClick={onEdit} sx={{marginX:'0.5em'}} variant="contained" color="warning" >
                        <Edit></Edit>
                    </IconButton>
                    {
                        adminLevel == 1 ? '' : (
                            <IconButton onClick={onDelete} sx={{marginX:'0.5em'}} variant="contained" color="error" >
                                <Delete></Delete>
                            </IconButton>
                        )
                    }
                </TableCell>
                    )
                }
                
            </TableRow>
        </>
    )
}