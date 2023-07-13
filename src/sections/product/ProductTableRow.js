import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Details from "@mui/icons-material/Details";
import {Button, IconButton, TableCell, TableRow} from "@mui/material"

export default function ProductTableRow({row, num, onShowImage, onDelete, onEdit}){
    let {productName, productPrice, productStock, created_at} = row;
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
                    {productPrice}
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