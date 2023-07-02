import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import {Button, IconButton, TableCell, TableRow} from "@mui/material"

export default function UsahaTableRow({row, num, onShowImage, onDelete, onEdit}){
    let {usahaName, usahaImage, usahaDesc, products, created_at} = row;
    return (
        <>
        
            <TableRow>
                <TableCell width={'25px'}>
                    {num}
                </TableCell>
                <TableCell>
                    {created_at}
                </TableCell>
                <TableCell>
                    {usahaName}
                </TableCell>
                <TableCell>
                    {usahaDesc}
                </TableCell>
                <TableCell>
                    {products.length}
                </TableCell>
                <TableCell>
                    <Button onClick={onShowImage}>
                        {usahaImage}
                    </Button>
                </TableCell>
                <TableCell align="center" width={'150px'} sx={{display:'flex'}}>
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