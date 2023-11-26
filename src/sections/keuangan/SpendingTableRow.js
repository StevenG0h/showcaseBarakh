import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Details from "@mui/icons-material/Details";
import {Button, DialogTitle, FormControl, IconButton, MenuItem, Select, TableCell, TableRow} from "@mui/material"
import { ConfirmDialog } from "../../components/dialog/ConfirmDialog";
import { useState } from "react";
import axios from "../../utils/axios";
import { useRouter } from "next/router";
import { formatCurrency } from "../../helper/currency";
import { fDate } from "../../helper/date";

export default function SpendingTableRow({row, num, onShowImage, onDelete, onEdit, onDetail}){
    let {transactionType, spending} = row;
    let {SpendingName, SpendingDescription, create_time, SpendingValue, unit_usaha} = spending;
    let [newTransactionStatus, setNewTransactionStatus] = useState(false);
    let handleChangeStatus = (data)=>{
        setNewTransactionStatus(data)
    }
    let handleCloseDialog = ()=>{
        setNewTransactionStatus(false)
    }
    let msg = 'Anda yakin ingin menghapus data pengeluaran ini?'
    return (
        <>
            <TableRow>
                <ConfirmDialog onConfirm={()=>{
                onDelete()
                handleCloseDialog()
                }} onCancel={()=>{handleCloseDialog()}} msg={msg} open={newTransactionStatus}></ConfirmDialog>
                <TableCell>{num}</TableCell>
                <TableCell>{unit_usaha.usahaName}</TableCell>
                <TableCell>{fDate(create_time)}</TableCell>
                <TableCell>{transactionType}</TableCell>
                <TableCell>Rp.{formatCurrency(SpendingValue)}</TableCell>
                <TableCell align="center">
                    <IconButton onClick={onEdit} sx={{marginX:'0.5em'}} variant="contained" color="warning" >
                        <Edit></Edit>
                    </IconButton>
                    <IconButton onClick={()=>setNewTransactionStatus(true)} sx={{marginX:'0.5em'}} variant="contained" color="error" >
                        <Delete></Delete>
                    </IconButton>
                </TableCell>
            </TableRow>
        </>
    )
}