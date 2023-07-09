import { TextField, Typography, Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";


export default function RHFAutocomplete({name, disable=true, options = [], handleChange, label, control, defaultValue='',  }){

      return (
        <>
            <Typography>
                {label}
            </Typography>
            <Controller
                render={({ onChange, ...props }) => (
                    <Autocomplete
                    disabled={disable}
                    options={options}
                    renderInput={(params) => <TextField {...params} label={label} />}
                    onChange={(e, data) => {
                        handleChange(data?.id)
                        return data
                    }}
                    {...props}
                    />
                )}
                onChange={([, data]) => data}
                defaultValue={defaultValue}
                name={name}
                control={control}
                />
        </>
      )
}