import { TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";


export default function RHFTextFieldAuth({control, name, label, hiddenLabel = false, type="text", sx}){

      return (
        <>
            <Typography>
                {label}
            </Typography>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState:{ error} }) => <TextField variant="outlined" sx={{width:'100%', color:'white', input:{color:'white'}}} color="success"  type={type} hiddenLabel error={!!error} helperText={error ? error?.message : ''} label={hiddenLabel ? label : ''} focused {...field} />}
            />
        </>
      )
}