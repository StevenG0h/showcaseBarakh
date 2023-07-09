import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Details from "@mui/icons-material/Details";
import {Button, IconButton, TableCell, TableRow} from "@mui/material"

export default function DetailPenjualanTableRow({row, num, onShowImage, onDelete, onEdit, onDetail}){
    let {productPrice, product, productCount} = row;
    return (
        <>
            <TableRow>
                <TableCell width={'25px'}>
                    {num}
                </TableCell>
                <TableCell>
                    {product.productName}
                </TableCell>
                <TableCell>
                    {productPrice}
                </TableCell>
                <TableCell>
                    {productCount}
                </TableCell>
                <TableCell>
                    {Number(productCount) * Number(productPrice)}
                </TableCell>
                <TableCell align="left" width={'150px'} sx={{display:'flex'}}>
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