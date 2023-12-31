import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import {Button, IconButton, TableCell, TableRow} from "@mui/material"
import { useRouter } from "next/router";

export default function UsahaTableRow({row, num, onShowImage, onDelete, onEdit, onShowLogo, isSuper}){
    let {usahaName, usahaImage, usahaDesc, products, created_at, unitUsahaLogo, orders} = row;
    let productCount = products.filter(product=> product.isActive == 1);
    const router = useRouter()
    
    return (
        <>
        
            <TableRow sx={{width:'100%'}}>
                <TableCell width={'25px'}>
                    {orders}
                </TableCell>
                {/* <TableCell>
                    {created_at}
                </TableCell> */}
                <TableCell>
                    {usahaName}
                </TableCell>
                <TableCell>
                    {usahaDesc}
                </TableCell>
                <TableCell>
                    {productCount.length}
                </TableCell>
                <TableCell>
                    <Button sx={{textAlign:'left'}} color="success" onClick={onShowLogo}>
                        {unitUsahaLogo}
                    </Button>
                </TableCell>
                <TableCell>
                    <Button sx={{textAlign:'left'}} color="success" onClick={onShowImage}>
                        {usahaImage}
                    </Button>
                </TableCell>
                {
                    isSuper == true ? (
                        <TableCell align="center" width={'150px'}>
                            <IconButton onClick={onEdit} sx={{marginX:'0.5em'}} variant="contained" color="warning" >
                                <Edit></Edit>
                            </IconButton>
                            <IconButton onClick={onDelete} sx={{marginX:'0.5em'}} variant="contained" color="error" >
                                <Delete></Delete>
                            </IconButton>
                        </TableCell>
                    ) : ''
                }
            </TableRow>
        </>
    )
}