import { TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";


export default function RHFTextField({control, name, label, hiddenLabel = false, type="text", sx}){

      return (
        <>
            <Typography>
                {label}
            </Typography>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState:{ error} }) => <TextField  sx={{width:'100%'}}  type={type} hiddenLabel error={!!error} helperText={error ? error?.message : ''} label={hiddenLabel ? label : ''} {...field} />}
            />
        </>
      )
}