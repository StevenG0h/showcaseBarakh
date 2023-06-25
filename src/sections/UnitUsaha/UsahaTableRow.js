import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import {IconButton, TableCell, TableRow} from "@mui/material"

export default function UsahaTableRow({row, num, onDelete, onEdit}){
    let {usahaName, usahaImage} = row;
    return (
        <TableRow>
            <TableCell width={'25px'}>
                {num}
            </TableCell>
            <TableCell>
                {usahaName}
            </TableCell>
            <TableCell>
                {usahaImage}
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
    )
}