import Block from "@mui/icons-material/Block";
import Check from "@mui/icons-material/Check";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import Details from "@mui/icons-material/Details";
import {Button, IconButton, TableCell, TableRow} from "@mui/material"
import {fDate} from '../../helper/date';
export default function UserTableRow({row, num, onShowImage, isSuper, onDelete, onActive, onDestroy, onEdit}){
    let {email, admins,created_at } = row;
    let {adminName, adminNum, adminLevel,role,unit_usaha, isActive, deleted_at} =  admins;
    let {roleName, permission} =  role;
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
                    {roleName}
                </TableCell>
                {
                    isActive != 0 ? (
                        <TableCell>
                        {fDate(created_at)}
                        </TableCell>
                    ) : (<>
                        <TableCell>
                            {fDate(deleted_at)}
                        </TableCell>
                        <TableCell align="center">
                            <IconButton onClick={onActive} sx={{marginX:'0.5em'}} variant="contained" color="success" >
                                <Check></Check>
                            </IconButton>
                            <IconButton onClick={onDestroy} sx={{marginX:'0.5em'}} variant="contained" color="error" >
                                <Delete></Delete>
                            </IconButton>
                        </TableCell>
                    </>
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
                        permission == 1 ? '' : (
                            <IconButton onClick={onDelete} sx={{marginX:'0.5em'}} variant="contained" color="error" >
                                <Block></Block>
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