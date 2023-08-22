import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Details from "@mui/icons-material/Details";
import {Button, DialogTitle, FormControl, IconButton, MenuItem, Select, TableCell, TableRow} from "@mui/material"
import { ConfirmDialog } from "../../components/dialog/ConfirmDialog";
import { useState } from "react";
import axios from "../../utils/axios";
import { useRouter } from "next/router";
import { fDate } from "../../helper/date";
import { formatCurrency } from "../../helper/currency";

export default function TotalTableRow({row,num}){

    let {penjualan, pengeluaran, year, month} = row
    let labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'];
    return (
        <>
            <TableRow>
                <TableCell width={'25px'}>
                    {num}
                </TableCell>
                <TableCell>
                    Rp.{formatCurrency(penjualan)}
                </TableCell>
                <TableCell>
                    Rp.{formatCurrency(pengeluaran)}
                </TableCell>
                <TableCell>
                    {labels[month - 1]} {year}
                </TableCell>
                <TableCell >
                    Rp.{formatCurrency(penjualan - pengeluaran)}
                </TableCell> 
            </TableRow>
        </>
    )
}