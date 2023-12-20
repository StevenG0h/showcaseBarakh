import  Visibility from "@mui/icons-material/Visibility";
import VisibilityOff  from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment, OutlinedInput, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Controller } from "react-hook-form";


export default function RHFPassword({control, name, label, hiddenLabel = false,  sx}){
     let [showPassword, setShowPassword] = useState(false);
     let handleClickShowPassword = ()=>{
        setShowPassword(!showPassword)
     }
      return (
        <>{ hiddenLabel== true?'': (
            <Typography>
                {label}
            </Typography>

        )
            
        }
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState:{ error} }) => <OutlinedInput  
                    sx={{width:'100%'}}  
                    hiddenLabel 
                    error={!!error} 
                    helperText={error ? error?.message : ''} label={label} {...field}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    } />
            }
            />
        </>
      )
}