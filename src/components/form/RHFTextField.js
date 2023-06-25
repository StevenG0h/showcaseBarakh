import { Font } from "@/helper/font";
import { FormControl, TextField } from "@mui/material";
import { Controller, useController } from "react-hook-form";


export default function RHFTextField({control, name, label}){

      return (
        <>
            <label className={Font.PoppinsFont.className}>
                {label}
            </label>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState:{ error} }) => <TextField error={!!error} helperText={error ? error?.message : ''} label={label} {...field} />}
            />
        </>
      )
}