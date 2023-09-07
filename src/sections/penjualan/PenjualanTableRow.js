import Edit from "@mui/icons-material/Edit";
import {Button, DialogTitle, FormControl, IconButton, MenuItem, Select, TableCell, TableRow} from "@mui/material"
import { ConfirmDialog } from "../../components/dialog/ConfirmDialog";
import { useState } from "react";
import axios from "../../utils/axios";
import { useRouter } from "next/router";
import { formatCurrency } from "../../helper/currency";
import { fDate } from "../../helper/date";

export default function PenjualanTableRow({row, num, onShowImage, onDelete, onEdit, onDetail}){
    const router = useRouter();
    let {transactionStatus, sales} = row;
    let [newTransactionStatus, setNewTransactionStatus] = useState('');
    let msg = 'Anda yakin ingin mengubah status transaksi?';
    // let {productName, productPrice} = product
    let {clientName} = row?.sales[0].client;
    let total = 0;
    sales.map((sales)=>{
        return total+= Number(sales.productPrice) * Number(sales.productCount)
    })
    let handleChangeStatus = (data)=>{
        setNewTransactionStatus(data)
    }
    let handleCloseDialog = (data)=>{
        setNewTransactionStatus('')
    }
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
    const status = [
        {value:'BELUMTERVERIFIKASI',label:'Belum Terverifikasi'},
        {value:'TERVERIFIKASI',label:'Terverifikasi'},
        {value:'PENGIRIMAN',label:'Pengiriman'},
        {value:'SELESAI',label:'SELESAI'},
        {value:'BATAL',label:'BATAL'}
    ]
    return (
        <>
            <ConfirmDialog onConfirm={()=>{
                handleUpdateTransaction()
                setNewTransactionStatus('')
            }} onCancel={()=>{handleCloseDialog()}} msg={msg} open={newTransactionStatus != '' ?true :false}></ConfirmDialog>
            <TableRow>
                <TableCell width={'25px'}>
                    {num}
                </TableCell>
                <TableCell>
                    {clientName}
                </TableCell>
                <TableCell>
                    {row.sales[0].transactionAddress}
                </TableCell>
                
                <TableCell width="150px">
                    {fDate(row.created_at)}
                </TableCell>
                <TableCell>
                    Rp.{formatCurrency(total)}
                </TableCell>
                <TableCell width="150px">
                    <FormControl>
                        <Select
                            sx={{border:'none', outline:'none',margin:0,padding:0}}
                            defaultValue={transactionStatus}
                            onChange={(e)=>{
                                handleChangeStatus(e.target.value)
                            }}
                        >
                            {
                                status.map(({value,label})=>{
                                    return (
                                        <MenuItem value={value}>{label}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell align="left" >
                    <IconButton onClick={onDetail} sx={{marginX:'0.5em'}} variant="contained" color="warning" >
                        <Edit></Edit>
                    </IconButton>
                </TableCell>
            </TableRow>
        </>
    )
}