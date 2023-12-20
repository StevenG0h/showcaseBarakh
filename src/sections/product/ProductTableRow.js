import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Details from "@mui/icons-material/Details";
import {Button, IconButton, TableCell, TableRow} from "@mui/material"
import { fDate } from "../../helper/date";
import { formatCurrency } from "../../helper/currency";

export default function ProductTableRow({row, num, onShowImage, onDelete, onEdit}){
    let {productName, productPrice,productDisc, productStock, created_at, updated_at} = row;
    return (
        <>
        
            <TableRow>
                <TableCell width={'25px'}>
                    {num}
                </TableCell>
                <TableCell>
                    {productName}
                </TableCell>
                <TableCell>
                    {productStock < 0 ? 0 : productStock}
                </TableCell>
                <TableCell>
                    Rp.{formatCurrency(productPrice)}
                </TableCell>
                <TableCell>
                    {productDisc == null ? 0 : productDisc}%
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
                    <IconButton onClick={onDelete} sx={{marginX:'0.5em'}} variant="contained" color="error" >
                        <Delete></Delete>
                    </IconButton>
                </TableCell>
            </TableRow>
        </>
    )
}