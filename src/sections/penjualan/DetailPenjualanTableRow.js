import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Details from "@mui/icons-material/Details";
import {Button, IconButton, TableCell, TableRow} from "@mui/material"
import { useState } from "react";
import { ConfirmDialog } from "../../components/dialog/ConfirmDialog";

export default function DetailPenjualanTableRow({row, num, onShowImage, onDelete, onEdit, onDetail}){
    let {productPrice, product, productCount} = row;
    let [newTransactionStatus, setNewTransactionStatus] = useState(false);
    let handleChangeStatus = (data)=>{
        setNewTransactionStatus(data)
    }
    let handleCloseDialog = (data)=>{
        setNewTransactionStatus(true)
    }
    let msg = 'Anda yakin ingin menghapus data penjualan ini?'
    let handleUpdateTransaction = async ()=>{
        let data = {
            transactionStatus: newTransactionStatus
        }
        try{
            let update = await axios.put(process.env.NEXT_PUBLIC_BACKEND_URL+'/api/transaksi/'+row.id,data)
        }catch(e){

        }finally{
            router.replace(router.asPath);
        }
    }
    return (
        <>
            <TableRow>
                <ConfirmDialog onConfirm={()=>{onDelete()}} onCancel={()=>{handleCloseDialog()}} msg={msg} open={newTransactionStatus}></ConfirmDialog>
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
                <TableCell align="center">
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