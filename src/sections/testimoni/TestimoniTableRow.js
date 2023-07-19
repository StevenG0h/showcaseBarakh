import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Details from "@mui/icons-material/Details";
import {Button, IconButton, TableCell, TableRow} from "@mui/material"
import { formatDate } from "../../helper/data";

export default function TestimoniTableRow({row, num, onShowImage, onDelete, onEdit}){
    let {clientName, testimonyDesc, created_at, updated_at} = row;
    return (
        <>
        
            <TableRow>
                <TableCell width={'25px'}>
                    {num}
                </TableCell>
                <TableCell>
                    {clientName}
                </TableCell>
                <TableCell>
                    {testimonyDesc}
                </TableCell>
                <TableCell>
                    {formatDate(created_at)}
                </TableCell>
                <TableCell>
                    {formatDate(updated_at)}
                </TableCell>
                <TableCell align="center" >
                    <IconButton onClick={onEdit} sx={{marginX:'0.5em'}} variant="contained" color="warning" >
                        <Edit></Edit>
                    </IconButton>
                    <IconButton onClick={onDelete} sx={{marginX:'0.5em'}} variant="contained" color="error" >
                        <Delete></Delete>
                    </IconButton>
                </TableCell>
            </TableRow>
        </>
    )
}