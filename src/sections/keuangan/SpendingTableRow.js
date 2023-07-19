import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Details from "@mui/icons-material/Details";
import {Button, DialogTitle, FormControl, IconButton, MenuItem, Select, TableCell, TableRow} from "@mui/material"
import { ConfirmDialog } from "../../components/dialog/ConfirmDialog";
import { useState } from "react";
import axios from "../../utils/axios";
import { useRouter } from "next/router";

export default function SpendingTableRow({row, num, onShowImage, onDelete, onEdit, onDetail}){
    let {transactionType, spending} = row;
    console.log(spending);
    let {SpendingName, SpendingDescription, SpendingValue, unit_usaha} = spending;
    return (
        <>
            <TableRow>
                <TableCell>{num}</TableCell>
                <TableCell>{unit_usaha.usahaName}</TableCell>
                <TableCell>{transactionType}</TableCell>
                <TableCell>{SpendingValue}</TableCell>
            </TableRow>
        </>
    )
}