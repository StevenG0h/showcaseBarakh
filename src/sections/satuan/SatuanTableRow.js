import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import {Button, IconButton, TableCell, TableRow} from "@mui/material"

export default function SatuanTableRow({row, num, onShowImage, onDelete, onEdit}){
    let {roleName, permission} = row;
    return (
        <>
        
            <TableRow>
                <TableCell width={'25px'}>
                    {num}
                </TableCell>
                <TableCell>
                    {roleName}
                </TableCell>
                <TableCell align="center" >
                    <IconButton onClick={onEdit} sx={{marginX:'0.5em'}} variant="contained" color="warning" >
                        <Edit></Edit>
                    </IconButton>
                    {
                        permission == 0 ? (
                            <IconButton onClick={onDelete} sx={{marginX:'0.5em'}} variant="contained" color="error" >
                                <Delete></Delete>
                            </IconButton>
                        ) : ''
                    }
                    
                </TableCell>
            </TableRow>
        </>
    )
}