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
import GaleriTableRow from "../../../sections/galeri/GaleriTableRow";
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
        let galeri = await axios.get('/api/admin/galeri',{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        console.log(galeri);
        return {
            props:{
                data: galeri.data.data
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

export default function galeri({data}){
    const token = getCookie('token');
    let [loading, setLoading] = useState(false)
    let [galeris, setgaleriUsahas] = useState(data?.data);
    let [links, setUnitUsahaLink] = useState(data?.links);
    let [imageData, setImage] = useState([]);
    let [deletedImage, setDeletedImage] = useState([]);
    let [imageBackup, setImageBackup] = useState([]);
    let [deleteId, setDelete] = useState('');
    //Next router
    const router = useRouter();

    //React hook form and YUP validator
    const schema = yup.object().shape({
        galeriTitle: yup.string().required('Judul tidak boleh kosong'),
        galeriDate: yup.string().required('Tanggal tidak boleh kosong'),
    })

    const { control, handleSubmit, getValues, setValue, reset, register , formState:{errors}} = useForm({
        defaultValues: {
            id: ''  ,
          galeriDate:'',
          galeriTitle: "",
          path: ""
        },
        resolver: yupResolver(schema)
      })
    
      const onSubmit = async (data) => {
        setLoading(true)
        console.log(data)
        if(editMode == false){
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                console.log(data)
                await axios.post('/api/admin/galeri',data,{
                    headers: { Authorization: `Bearer `+token, "Content-Type":'multipart/form-data'},
                    withCredentials: true,
                }).then((r)=>{
                    handleCloseAddForm();
                    console.log(r.data)
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
                await axios.post('/api/admin/galeri/edit/'+data.id,data,{
                    headers: { Authorization: `Bearer `+token, "Content-Type":'multipart/form-data'},
                    withCredentials: true,
                }).then((r)=>{
                handleCloseAddForm();
                    console.log(r.data)
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
            const deleteUnitUsaha = await axios.delete('/api/admin/galeri/'+id,{
                headers:{
                    Authorization: `Bearer `+token
                }
            }).then((r)=>{
                router.replace(router.asPath)
                setDelete('');
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
        setValue('galeriTitle','');
        setValue('galeriDate','');
        setImage('path');
        setShowImage('')
    }
    
    let handleOpenEditForm = (data)=>{
        setEditMode(true);
        setValue('id',data.id);
        setValue('galeriTitle',data?.galeriTitle);
        setValue('galeriDate',data?.galeriDate);
        setValue('galeriDate',data?.galeriDate);
        setValue('path',data?.path);
        setAddForm(true)
    }
   
    let handleShowImage = (data)=>{
        setShowImage(process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/galeri/'+data)
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
        {value: 'Judul',align: 'left'},
        {value: 'Kegiatan pada',align: 'left'},
        {value: 'Gambar',align: 'left'},
        {value: 'Action',align: 'center'}
    ]
    
    let num = 0;

    useEffect(() => {
        setgaleriUsahas(data.data)
        setUnitUsahaLink(data.links)
      }, [data]);

    return (
        <>
            <ConfirmDialog open={deleteId != ''} onCancel={()=>{setDelete('')}} onConfirm={()=>{handleDelete(deleteId)}} msg={'Anda yakin ingin menghapus?'}></ConfirmDialog>
            <AdminLayout handleLoading={loading}>
                <Dialog open={showImage != ''} onClose={handleCloseShowImage} fullWidth maxWidth={'md'}>
                        <img height={"100%"} style={{objectFit:'contain'}} src={showImage}></img>
                </Dialog>
                <Dialog open={AddForm} sx={{overflow:'hidden'}} onClose={handleCloseAddForm} fullWidth maxWidth='xs'>
                    <DialogContent>
                        <Typography variant="h5" sx={{marginBottom:'1em'}} fontWeight={600}>{editMode? 'Edit Galeri' : 'Tambah Galeri'}</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField hiddenLabel={false} label={'Judul'} name={"galeriTitle"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField type="date" hiddenLabel={false} label={'Tanggal'} name={"galeriDate"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{marginY:'0.5em',display:'flex', flexDirection:'row', flexWrap:'wrap', width:'99%',overflow:'hidden'}}>
                                <Box sx={{width:'100%'}}>
                                    <RHFDnd name="path" files={process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/galeri/'+getValues('path')} control={control}></RHFDnd>
                                </Box>
                            </FormControl>
                            <Button variant="contained" color="success" sx={{width:'100%'}} type="submit">{editMode ? 'Simpan Perubahan' : 'Tambah Galeri'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Typography variant="h3" color={'#94B60F'} sx={{textDecoration:'underline'}} fontWeight={400}>Galeri</Typography>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center', marginY:'1em'}}>
                    <Button onClick={handleOpenAddForm} color="success" variant="contained" startIcon="">
                        Tambah Galeri
                    </Button>
                </Box>
                <Card sx={{marginY:'1em'}}>
                    <TableContainer>
                        <Table>
                            <CustomTableHead tableHead={TABLEHEAD}></CustomTableHead>
                            <TableBody>
                                {
                                    galeris.length==0 ? (
                                        <TableRow>
                                            <TableCell>Data kosong</TableCell>
                                        </TableRow>
                                    ) :
                                    galeris.map((map)=>{
                                        return ( <>
                                            <GaleriTableRow 
                                            key={map.id} 
                                            onDelete={() => setDelete(map.id)} 
                                            onEdit={() => handleOpenEditForm(map)} 
                                            onShowImage={()=> handleShowImage(map.path)}
                                            num={++num} row={map}>

                                            </GaleriTableRow>
                                        </>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                        {
                            links.map((link)=>{
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