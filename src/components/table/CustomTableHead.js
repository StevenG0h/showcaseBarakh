import { TableCell, TableHead, TableRow, Typography } from "@mui/material"

export default function CustomTableHead({tableHead}){
    return (
        <TableHead sx={{width:'100%'}}>
            <TableRow>
                {
                    tableHead.map((map)=>{
                        return(
                            <TableCell key={map.value} align={map.align}>
                                <Typography noWrap fontWeight="600">{map.value}</Typography>
                            </TableCell>
                        )
                    })
                }
            </TableRow>
        </TableHead>
    )
}