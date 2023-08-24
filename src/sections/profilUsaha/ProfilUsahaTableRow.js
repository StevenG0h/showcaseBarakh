import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Details from "@mui/icons-material/Details";
import {Button, IconButton, TableCell, TableRow} from "@mui/material"
import { formatDate } from "../../helper/data";
import { fDate } from "../../helper/date";

export default function ProfilUsahaTableRow({row, num, onShowImage, onDelete, onEdit}){
    let {usahaName, created_at, updated_at} = row;
    return (
        <>
        
            <TableRow>
                <TableCell width={'25px'}>
                    {num}
                </TableCell>
                <TableCell>
                    {usahaName}
                </TableCell>
                <TableCell>
                    {fDate(created_at)}
                </TableCell>
                <TableCell>
                    {fDate(updated_at)}
                </TableCell>
                <TableCell align="center" >
                    <IconButton onClick={onEdit} sx={{marginX:'0.5em'}} variant="contained" color="warning" >
                        <Edit></Edit>
                    </IconButton>
                </TableCell>
            </TableRow>
        </>
    )
}