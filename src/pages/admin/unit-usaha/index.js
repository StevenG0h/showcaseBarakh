import CustomTableHead from "@/components/table/CustomTableHead"
import AdminLayout from "@/layouts/adminLayout/AdminLayout"
import UsahaTableRow from "@/sections/UnitUsaha/UsahaTableRow";
import { Box, Button, Card, Dialog, DialogContent, DialogTitle, FormControl, Input, MenuItem, MenuList, Select, Table, TableBody, TableContainer, TextField, Typography } from "@mui/material"
import axios from "@/utils/axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import RHFTextField from "@/components/form/RHFTextField";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import Image from "next/image";
import RHFDnd from "@/components/form/RHFDnd";
import ArrowBack  from "@mui/icons-material/ArrowLeft";
import ArrowNext  from "@mui/icons-material/ArrowRight";

export async function getServerSideProps(context){

    let UnitUsaha = await axios.get('http://127.0.0.1:8000/api/unit-usaha');
    
    return {
        props: {
            data: UnitUsaha?.data?.data
        }
    }
}

export default function admin({data}){
    
    let [unitUsaha, setUnitUsaha] = useState(data.data);
    let [unitUsahaLink, setUnitUsahaLink] = useState(data.links);
    //Next router
    const router = useRouter();

    //React hook form and YUP validator
    const schema = yup.object().shape({
        usahaName: yup.string().required('Nama unit usaha tidak boleh kosong'),
        usahaDesc: yup.string().required('Deskripsi unit usaha tidak boleh kosong'),
        usahaImage: yup.mixed()
        .test("filesize", "Gambar tidak boleh kosong", (value) => {
            if(editMode == false){
                if(value.name === undefined){
                    return false;
                }
                return true;
            }else{
                return true;
            }
          })
    })

    const { control, handleSubmit, setValue, reset, register , formState:{errors}} = useForm({
        defaultValues: {
          usahaName: "",
          usahaDesc: "",
          usahaImage: ""
        },
        resolver: yupResolver(schema)
      })
    
      const onSubmit = async (data) => {
        if(!editMode){
            const createUnitUsaha = await axios.post('/api/unit-usaha/',data,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            });
        }else{
            if(data.usahaImage == ''){
                delete data.usahaImage;
            }
            console.log(data);
            const createUnitUsaha = await axios.post('/api/unit-usaha/'+usahaId,data,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            });
            
        }
        router.reload()
        handleCloseAddForm()
      }
      
      //states
    const [showImage, setShowImage] = useState('');
    const [AddForm, setAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [usahaId, setUsahaId] = useState('');
    
    //handler
    async function handleDelete(id){
        const csrf = await axios.get('/sanctum/csrf-cookie')
        const deleteUnitUsaha = await axios.delete('/api/unit-usaha/'+id);
        router.reload()
    }

    //state handler
    let handleOpenAddForm = ()=>{
        setAddForm(true)
    }

    let handleCloseAddForm = ()=>{
        setEditMode(false);
        setAddForm(false);
        setValue('usahaName','');
        setValue('usahaDesc','');
        setValue('usahaImage','');
        setUsahaId('');
        reset({
            usahaDesc:'',
            usahaName:'',
            usahaImage:''
        });
    }
    
    let handleOpenEditForm = (data)=>{
        setEditMode(true);
        setValue('usahaName',data.usahaName);
        setValue('usahaDesc',data.usahaDesc);
        setUsahaId(data.id);
        setAddForm(true)
    }
   
    let handleShowImage = (data)=>{
        setShowImage(process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/unitUsaha/'+data)
    }
    
    let handleCloseShowImage = (data)=>{
        setShowImage('')
    }

    let handleChangePage = async (link)=>{
        let unitUsaha = await axios.get(link);
        setUnitUsaha(unitUsaha?.data?.data?.data)
        console.log(unitUsaha)
        setUnitUsahaLink(unitUsaha?.data?.data?.links)
    }

    //utils

    let TABLEHEAD = [
        {value: 'No',align: 'left'},
        {value: 'Dibuat pada',align: 'left'},
        {value: 'Nama unit usaha',align: 'left'},
        {value: 'Deskripsi',align: 'left'},
        {value: 'Jumlah Produk',align: 'left'},
        {value: 'Gambar',align: 'left'},
        {value: 'Action',align: 'center'}
    ]
    
    let num = 0;

    return (
        <>
            <AdminLayout>
                <Dialog open={showImage != ''} onClose={handleCloseShowImage} fullWidth maxWidth={'md'}>
                        <img height={"100%"} style={{objectFit:'contain'}} src={showImage}></img>
                </Dialog>
                <Dialog open={AddForm} onClose={handleCloseAddForm} fullWidth maxWidth='xs'>
                    <DialogContent>
                        <Typography variant="h5" sx={{marginBottom:'1em'}} fontWeight={600}>Tambah Unit Usaha</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField hiddenLabel={true} label={'Nama Unit Usaha'} name={"usahaName"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField hiddenLabel={true} label={'Deskripsi Unit Usaha'} name={"usahaDesc"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                            <Controller
                                control={control}
                                name={'usahaImage'}
                                rules={{required:'Foto unit usaha tidak boleh kosong'}}
                                render={({field:{value, onChange, ...field},fieldState:{error}})=>{
                                    return (
                                        <>
                                        <Input type="file" onChange={(event)=>{
                                        onChange(event.target.files[0])
                                    }} value={value?.filename} name={'usahaImage'} {...field}></Input>
                                        <Typography>{error?.message}</Typography>
                                        </>
                                    )
                                }}
                                >
                                
                                </Controller>
                            </FormControl>
                            <Button variant="contained" color="success" sx={{width:'100%'}} type="submit">{editMode ? 'Simpan Perubahan' : 'Tambah Unit Usaha'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Typography variant="h3" fontWeight={400}>Unit Usaha</Typography>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    {/* <Typography variant="h6" fontWeight={400} sx={{marginY:'1em',marginRight:'0.5em'}}>Unit Usaha: </Typography>
                    <Select variant="standard" displayEmpty>
                        <MenuItem>
                            <Typography>Hehe</Typography>
                        </MenuItem>
                        <MenuItem>
                            <Typography>Hehe</Typography>
                        </MenuItem>
                    </Select> */}
                    <Button onClick={handleOpenAddForm} color="success" variant="contained" startIcon="">
                        Tambah Unit Usaha
                    </Button>
                </Box>
                <Card sx={{marginY:'1em'}}>
                    <TableContainer>
                        <Table>
                            <CustomTableHead tableHead={TABLEHEAD}></CustomTableHead>
                            <TableBody>
                                {
                                    unitUsaha === [] || unitUsaha==='' || unitUsaha === undefined ? 'data kosong' :
                                    unitUsaha?.map((map)=>{
                                        return (
                                            <UsahaTableRow key={map.id} 
                                            onDelete={() => handleDelete(map.id)} 
                                            onEdit={() => handleOpenEditForm(map)} 
                                            onShowImage={()=> handleShowImage(map.usahaImage)}
                                            num={++num} row={map}>

                                            </UsahaTableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {
                        unitUsahaLink.map((link)=>{
                            return (
                                <Button key={link.label} sx={{color:link.active ? '' : 'grey' }} onClick={()=> handleChangePage(link.url)}>{
                                    link.label == '&laquo; Previous'? '' : link.label == 'Next &raquo;' ? '' : link.label
                                }</Button>
                            )
                        })
                    }
                </Card>
            </AdminLayout>
        </>
    )
}