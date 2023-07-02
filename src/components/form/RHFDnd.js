import  Delete  from "@mui/icons-material/Delete";
import { Box, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Controller } from "react-hook-form";

const fileTypes = ["JPG", "PNG", "GIF"];

function RHFDnd({name,control, files='', onDelete, required = false}) {
  const [file, setFile] = useState(files);
  const [disableRequire, setRequired] = useState(required);
  const handleChange = (file) => {
    let url = URL.createObjectURL(file)
    setFile(url);
  };
  return (
    <Controller 
    control={control}
    name={name}
    rules={{required:'Foto produk tidak boleh kosong'}}
    render={
        (
            {field:{value, onChange, ...field},fieldState:{error}}
        )=>(
            <Box>
                <FileUploader value="true" required={disableRequire} handleChange={
                (event)=>{
                    onChange(event)
                    handleChange(event)
                    setRequired(false)
                }
                } types={fileTypes} {...field}>
                <Box sx={{width:'100%',border:'0.1em solid black', minHeight:'5em'}}>
                    {
                        file == '' ? <Typography sx={{margin:'auto'}}>Upload</Typography> : <img style={{width:'100%',objectFit:'cover',aspectRatio:'1/1'}} src={file}></img>
                    }
                    <Typography>{error?.message}</Typography>
                </Box>
                </FileUploader>
                <IconButton onClick={()=>{
                    onDelete();
                    setFile('');
                }}>
                    <Delete></Delete>
                </IconButton>
            </Box>
        )
    }
    >
    </Controller>
  );
}

export default RHFDnd;