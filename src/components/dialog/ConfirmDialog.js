import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

export function ConfirmDialog({open, msg, onCancel, onConfirm, title="Konfirmasi Aksi"}){
    return (
        <>
            <Dialog maxWidth={'xs'} open={open} onClose={()=>{onCancel()}}>
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {msg}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button sx={{color:'grey'}} onClick={()=>{onCancel()}}>Tutup</Button>
                    <Button variant="contained" color="success" onClick={()=>{onConfirm()}}>Ya</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}