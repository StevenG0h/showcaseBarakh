import  Delete  from "@mui/icons-material/Delete";
import { Box, Button, IconButton, Typography } from "@mui/material";
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
  const [dndError, setDndError] = useState('');
  return (<>
    {
        dndError != '' ? (
            <Typography sx={{color:'red'}}>{dndError}</Typography>
        ) : ''
    }
    <Controller 
    control={control}
    name={name}
    rules={{required:'Foto produk tidak boleh kosong'}}
    render={
        (
            {field:{value, onChange, ...field},fieldState:{error}}
        )=>(
            <Box>
                {
                    file == '' ? '': 
                    <>
                            <IconButton  onClick={(e)=>{
                                e.preventDefault()
                                if(file != undefined){
                                    onDelete()
                                }
                                setFile('')
                                }} sx={{color: '#fff',marginLeft:'0.5em', backgroundColor:'red', position:'absolute', zIndex:'5000', marginTop:'0.5em'}} >
                                <Delete></Delete>
                            </IconButton>
                            
                    </>
                }
                
                <FileUploader maxSize={1} onSizeError={(file)=>{
                    setDndError(file)
                    setFile('')
                }} value="true" required={disableRequire} dropMessageStyle={
                    {display:'none'}
                } handleChange={
                (event)=>{
                    setDndError('')
                    onChange(event)
                    handleChange(event)
                    setRequired(false)
                }
                } types={fileTypes} {...field}>
                <Box sx={{width:'100%', cursor:'pointer',border:'0.1em solid #cccccc', aspectRatio:'4/3', overflow:'hidden', position:'relative', borderRadius:'0.3em'}}>
                    {
                        file == ''? <Typography sx={{margin:'auto', textAlign:'center', paddingY:'5em'}}>Upload</Typography> : 
                        <>
                                <img style={{width:'100%',objectFit:'cover',aspectRatio:'1/1'}} src={file}></img>
                                
                        </>
                    }
                    <Typography>{error?.message}</Typography>
                </Box>
                </FileUploader>
                
            </Box>
        )
    }
    >
    </Controller>
    
  </>
    
  );
}

export default RHFDnd;