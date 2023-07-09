import { Button, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";

export function ConfirmDialog({open, msg, onCancel, onConfirm}){
    return (
        <>
            <Dialog open={open} onClose={()=>{onCancel()}}>
                <DialogTitle>
                    Konfirmasi Aksi
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {msg}
                    </Typography>
                    <Button onClick={()=>{onCancel()}}>Tutup</Button>
                    <Button onClick={()=>{onConfirm()}}>Ya</Button>
                </DialogContent>
            </Dialog>
        </>
    )
}