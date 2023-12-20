import { MenuItem, Select, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";


export default function RHFSelect({control, option, name, label,defaultValue ='', hiddenLabel = false, type="text"}){

      return (
        <>
            <Typography>
                {label}
            </Typography>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState:{ error} }) => (
                    <Select {...field}>
                        {
                            option.map((data)=>{
                                return (<MenuItem value={data.id}>{data.label}</MenuItem>)
                            })
                        }
                    </Select>
                )}
            />
        </>
      )
}