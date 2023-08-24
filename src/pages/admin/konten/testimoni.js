import axios from "../../../utils/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import { Box, Button, Card, Dialog, DialogContent, FormControl, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Input, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import RHFTextField from "../../../components/form/RHFTextField";
import CustomTableHead from "../../../components/table/CustomTableHead";
import  Delete  from "@mui/icons-material/Delete";
import  Star  from "@mui/icons-material/Star";
import RHFDnd from "../../../components/form/RHFDnd";
import { getAllUnitUsaha } from "../../../helper/dataOptions";
import {getCookie} from 'cookies-next';
import TestimoniTableRow from "../../../sections/testimoni/TestimoniTableRow";
import  ChevronRight  from "@mui/icons-material/ChevronRight";
import  ChevronLeft  from "@mui/icons-material/ChevronLeft";
import { useEffect } from "react";
import { ConfirmDialog } from "../../../components/dialog/ConfirmDialog";

export async function getServerSideProps({req,res}){
    let token = getCookie('token',{req,res});
    if(token == undefined){
        return {
            redirect: {
              permanent: false,
              destination: "/auth",
            },
            props:{},
          };
    }
    await axios.get('/user',{
        headers:{
            Authorization: 'Bearer '+token,
        },
        withCredentials:true
    }).catch((e)=>{
        return {
            redirect: {
              permanent: false,
              destination: "/auth",
            },
            props:{},
          };
    })
    try{
        let testimoni = await axios.get('/api/admin/testimoni',{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        console.log(testimoni);
        return {
            props:{
                data: testimoni.data.data
            }
        }
    }catch(e){
        console.log(e)
        return {
            redirect: {
              permanent: false,
              destination: "/auth",
            },
            props:{},
          };
    }
}

export default function testimoni({data}){
    let [loading, setLoading] = useState(false)
    const token = getCookie('token');
    let [testimonis, settestimoniUsahas] = useState(data?.data);
    let [links, setUnitUsahaLink] = useState(data?.links);
    let [imageData, setImage] = useState([]);
    let [deletedImage, setDeletedImage] = useState([]);
    let [imageBackup, setImageBackup] = useState([]);
    let [deleteId, setDelete] = useState('');
    //Next router
    const router = useRouter();

    //React hook form and YUP validator
    const schema = yup.object().shape({
        testimonyDesc: yup.string().required('Testimoni tidak boleh kosong'),
        clientName: yup.string().required('Nama pelanggan tidak boleh kosong'),
    })

    const { control, handleSubmit, getValues, setValue, reset, register , formState:{errors}} = useForm({
        defaultValues: {
            id: ''  ,
            testimonyDesc:'',
            clientName: ""
        },
        resolver: yupResolver(schema)
      })
    
      const onSubmit = async (data) => {
        setLoading(true);
        console.log(data)
        if(editMode == false){
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                await axios.post('/api/admin/testimoni',data,{
                    headers: { Authorization: `Bearer `+token, "Content-Type":'multipart/form-data'},
                    withCredentials: true,
                }).then((r)=>{
                    console.log(r.data)
                
                    
                    router.replace(router.asPath);
                    handleCloseAddForm()
                }).catch((e)=>{
                    console.log(e);
                })
            }).catch((e)=>{
                console.log(e)
            })
        }else{
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                await  axios.put('/api/admin/testimoni/'+data.id,data,{
                    headers: { Authorization: `Bearer `+token},
                    withCredentials: true,
                }).then((r)=>{
                    console.log(r.data)
                
                    router.replace(router.asPath);
                    handleCloseAddForm()
                }).catch((e)=>{
                    console.log(e);
                })
            }).catch((e)=>{
                console.log(e)
            })
            
        }
        router.replace(router.asPath);
        setLoading(false)
      }
      
      //states
    const [showImage, setShowImage] = useState('');
    const [AddForm, setAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [usahaId, setUsahaId] = useState('');
    
    //handler
    async function handleDelete(id){
        const csrf = await axios.get('/sanctum/csrf-cookie',{
            withCredentials:true
        }).then(async (r)=>{
            const deleteUnitUsaha = await axios.delete('/api/admin/testimoni/'+id,{
                headers:{
                    Authorization: `Bearer `+token
                }
            }).then((r)=>{
                setDelete('')
                router.replace(router.asPath)
            });
        })
    }

    //state handler
    let handleOpenAddForm = ()=>{
        setAddForm(true)
    }

    let handleCloseAddForm = ()=>{
        setEditMode(false);
        setAddForm(false);
        setValue('id','');
        setValue('testimonyDesc','');
        setImage('path');
    }
    
    let handleOpenEditForm = (data)=>{
        setEditMode(true);
        setValue('id',data.id);
        setValue('testimonyDesc',data?.testimonyDesc);
        setValue('clientName',data?.clientName);
        setAddForm(true)
    }
   
    let handleShowImage = (data)=>{
        setShowImage(process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/testimoni/'+data)
    }
    
    let handleCloseShowImage = (data)=>{
        setShowImage('')
    }

    let handleDeletePreview = (id)=>{
        if(id != undefined){
            let deleteImage = deletedImage;
            deleteImage.push(id);
            setDeletedImage(deleteImage);
        }
    }

    let handleChangePage = async (link)=>{
        let unitUsaha = await axios.get(link);
        setUnitUsaha(unitUsaha?.data?.data?.data)
        setUnitUsahaLink(unitUsaha?.data?.data?.links)
    }

    //utils

    let TABLEHEAD = [
        {value: 'No',align: 'left'},
        {value: 'Nama Pelanggan',align: 'left'},
        {value: 'Testimoni',align: 'left'},
        {value: 'Dibuat pada',align: 'left'},
        {value: 'Diedit pada',align: 'left'},
        {value: 'Action',align: 'center'}
    ]
    
    let num = 0;

    useEffect(() => {
        settestimoniUsahas(data.data)
        setUnitUsahaLink(data.links)
      }, [data]);

    return (
        <>
            <ConfirmDialog open={deleteId != ''} onCancel={()=>{setDelete('')}} onConfirm={()=>{handleDelete(deleteId)}} msg={'Anda yakin ingin menghapus?'}></ConfirmDialog>
            <AdminLayout handleLoading={loading}>
                <Dialog open={AddForm} sx={{overflow:'hidden'}} onClose={handleCloseAddForm} fullWidth maxWidth='xs'>
                    <DialogContent>
                        <Typography variant="h5" sx={{marginBottom:'1em'}} fontWeight={600}>{editMode? 'Edit Testimoni' : 'Tambah Testimoni'}</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField  hiddenLabel={false} label={'Nama Pelanggan'} name={"clientName"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField hiddenLabel={false} label={'Testimoni'} name={"testimonyDesc"} control={control}></RHFTextField>
                            </FormControl>
                            <Button variant="contained" color="success" sx={{width:'100%'}} type="submit">{editMode ? 'Simpan Perubahan' : 'Tambah Testimoni'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Typography variant="h3" color={'#94B60F'} sx={{textDecoration:'underline'}} fontWeight={400}>Testimoni</Typography>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center', marginY:'1em'}}>
                    <Button onClick={handleOpenAddForm} color="success" variant="contained" startIcon="">
                        Tambah Testimoni
                    </Button>
                </Box>
                <Card sx={{marginY:'1em'}}>
                    <TableContainer>
                        <Table>
                            <CustomTableHead tableHead={TABLEHEAD}></CustomTableHead>
                            <TableBody>
                                {
                                    testimonis.length==0 ? (
                                        <TableRow>
                                            <TableCell>Data kosong</TableCell>
                                        </TableRow>
                                    ) :
                                    testimonis.map((map)=>{
                                        return ( <>
                                            <TestimoniTableRow 
                                            key={map.id} 
                                            onDelete={() => setDelete(map.id)} 
                                            onEdit={() => handleOpenEditForm(map)} 
                                            onShowImage={()=> handleShowImage(map.path)}
                                            num={++num} row={map}>

                                            </TestimoniTableRow>
                                        </>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                    {
                        
                        links.map((link,index)=>{
                            return (
                                <Button fullWidth size="sm" sx={{margin:'0.5em',paddingY:'1em', paddingX:'0', width:0, height:0}} key={link.label} variant={link.active ? 'contained' : 'outlined'} color={'success'} onClick={()=> handleChangePage(link.url)}>{
                                    link.label == '&laquo; Previous'? <ChevronLeft ></ChevronLeft> : link.label == 'Next &raquo;' ? <ChevronRight></ChevronRight> : link.label
                                }</Button>
                                )
                            })
                        }
                        </Box>
                </Card>
            </AdminLayout>
        </>
    )
}