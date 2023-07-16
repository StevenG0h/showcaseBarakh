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
import ProfilUsahaTableRow from "../../../sections/profilUsaha/ProfilUsahaTableRow";
import  Delete  from "@mui/icons-material/Delete";
import  Star  from "@mui/icons-material/Star";
import RHFDnd from "../../../components/form/RHFDnd";
import { getAllUnitUsaha } from "../../../helper/dataOptions";
import {getCookie} from 'cookies-next';

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
        let UnitUsaha = await axios.get('/api/admin/profil',{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        let option = await getAllUnitUsaha();
        return {
            props:{
                unitUsaha: UnitUsaha.data,
                option: option
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

export default function profil({unitUsaha,option}){
    let {usahaName} = unitUsaha;
    let [profilUsahas, setprofilUsahas] = useState(unitUsaha.data);
    let [imageData, setImage] = useState([]);
    let [deletedImage, setDeletedImage] = useState([]);
    let [imageBackup, setImageBackup] = useState([]);
    //Next router
    const router = useRouter();

    //React hook form and YUP validator
    const schema = yup.object().shape({
        unit_usaha_id: yup.number(),
        profil_usaha_desc: yup.string().required('Deskripsi unit usaha tidak boleh kosong'),
        profilUsahaImages: yup.mixed().test("filesize", "Gambar tidak boleh kosong", (value) => {
            if(editMode == false){
                if(value[0] === undefined){
                    return false;
                }
                return true;
            }else{
                return true;
            }
          }),
        deleteImage: yup.array().min(0)
    })

    const { control, handleSubmit, getValues, setValue, reset, register , formState:{errors}} = useForm({
        defaultValues: {
            id: ''  ,
          unit_usaha_id:'',
          profil_usaha_desc: "",
          profilUsahaImages: [
            {
                isFile:false
            },
            {
                isFile:false
            },
            {
                isFile:false
            },
            {
                isFile:false
            },
            {
                isFile:false
            },
            {
                isFile:false
            },
            {
                isFile:false
            },
            {
                isFile:false
            },
            {
                isFile:false
            },
            {
                isFile:false
            },
          ],
          deleteImages:[]
        },
        resolver: yupResolver(schema)
      })
    
      const onSubmit = async (data) => {
        let token = getCookie('token');
        console.log(data)
        data.deletedImage = deletedImage;
        if(editMode == false){
            
            data.profilUsahaImages = data.profilUsahaImages.map((image)=>{
                if(image?.isFile != false){
                    return image;
                }
            })
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                await axios.post('/api/admin/profil/',data,{
                    headers: { Authorization: `Bearer `+token, "Content-Type":'multipart/form-data'},
                    withCredentials: true,
                }).then((r)=>{
                    console.log(r.data)
                }).catch((e)=>{
                    console.log(e);
                })
            }).catch((e)=>{
                console.log(e)
            })
        }else{
            if(data.usahaImage == ''){
                delete data.usahaImage;
            }
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                await await axios.post('/api/admin/profil/edit/'+data.id,data,{
                    headers: { Authorization: `Bearer `+token, "Content-Type":'multipart/form-data'},
                    withCredentials: true,
                }).then((r)=>{
                    console.log(r.data)
                }).catch((e)=>{
                    console.log(e);
                })
            }).catch((e)=>{
                console.log(e)
            })
            
        }
        // router.reload();
      }
      
      //states
    const [showImage, setShowImage] = useState('');
    const [AddForm, setAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [usahaId, setUsahaId] = useState('');
    
    //handler
    async function handleDelete(id){
        const csrf = await axios.get('/sanctum/csrf-cookie')
        const deleteUnitUsaha = await axios.delete('/api/admin/profil/'+id);
        router.reload()
    }

    //state handler
    let handleOpenAddForm = ()=>{
        setAddForm(true)
    }

    let handleCloseAddForm = ()=>{
        setEditMode(false);
        setAddForm(false);
        setValue('id','');
        setValue('unit_usaha_id','');
        setValue('profil_usaha_desc','');
        setImage([]);
    }
    
    let handleOpenEditForm = (data)=>{
        setEditMode(true);
        setValue('id',data?.profil?.id);
        setValue('unit_usaha_id',data?.id);
        setValue('profil_usaha_desc',data.profil?.profil_usaha_desc);
        let images = [];
        for(let i=0; i<10;i++){
            let found = false;
            data?.profil?.profil_usaha_images.map((image)=>{
                if(image.order === i){
                    found = true;
                    return images.push(image)
                }
            })
            if(found == false){
                images.push({
                    isFile:false
                })
            }
        }
        console.log(images);
        setImage(images);
        setAddForm(true)
    }
   
    let handleShowImage = (data)=>{
        setShowImage(process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/unitUsaha/'+data)
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
    //utils

    let TABLEHEAD = [
        {value: 'No',align: 'left'},
        {value: 'Unit Usaha',align: 'left'},
        {value: 'Dibuat pada',align: 'left'},
        {value: 'Diedit pada',align: 'left'},
        {value: 'Action',align: 'center'}
    ]
    
    let num = 0;

    return (
        <>
            <AdminLayout>
                <Dialog open={AddForm} sx={{overflow:'hidden'}} onClose={handleCloseAddForm} fullWidth maxWidth='xs'>
                    <DialogContent>
                        <Typography variant="h5" sx={{marginBottom:'1em'}} fontWeight={600}>Tambah Profil</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {
                                getValues('unit_usaha_id') === '' ?
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                
                                    <Select name={'unit_usaha_id'}
                                onChange={(e)=>{setValue('unit_usaha_id',e.target.value)}}
                                >
                                    <MenuItem value={'*'}>Semua</MenuItem>
                                    {
                                        option.map((unitUsaha)=>{
                                            return (
                                                <MenuItem value={unitUsaha.id}>{unitUsaha.label}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                                : ''
                            }
                            
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField hiddenLabel={false} label={'Deskripsi profil'} name={"profil_usaha_desc"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{marginY:'0.5em',display:'flex', flexDirection:'row', flexWrap:'wrap', width:'99%',overflow:'hidden'}}>
                                <Box sx={{width:'49%'}}>
                                    <RHFDnd name="profilUsahaImages[0]" onDelete={()=>{handleDeletePreview(imageData[0]?.id)}} files={imageData[0] == undefined || imageData[0] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/profil/'+imageData[0]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'49%'}}>
                                    <RHFDnd name="profilUsahaImages[1]" onDelete={()=>{handleDeletePreview(imageData[1]?.id)}} files={imageData[1] == undefined || imageData[1] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/profil/'+imageData[1]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'49%'}}>
                                    <RHFDnd name="profilUsahaImages[2]" onDelete={()=>{handleDeletePreview(imageData[2]?.id)}} files={imageData[2] == undefined || imageData[2] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/profil/'+imageData[2]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'49%'}}>
                                    <RHFDnd name="profilUsahaImages[3]" onDelete={()=>{handleDeletePreview(imageData[3]?.id)}} files={imageData[3] == undefined || imageData[3] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/profil/'+imageData[3]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'49%'}}>
                                    <RHFDnd name="profilUsahaImages[4]" onDelete={()=>{handleDeletePreview(imageData[4]?.id)}} files={imageData[4] == undefined || imageData[4] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/profil/'+imageData[4]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'49%'}}>
                                    <RHFDnd name="profilUsahaImages[5]" onDelete={()=>{handleDeletePreview(imageData[4]?.id)}} files={imageData[4] == undefined || imageData[4] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/profil/'+imageData[4]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'49%'}}>
                                    <RHFDnd name="profilUsahaImages[6]" onDelete={()=>{handleDeletePreview(imageData[4]?.id)}} files={imageData[4] == undefined || imageData[4] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/profil/'+imageData[4]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'49%'}}>
                                    <RHFDnd name="profilUsahaImages[7]" onDelete={()=>{handleDeletePreview(imageData[4]?.id)}} files={imageData[4] == undefined || imageData[4] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/profil/'+imageData[4]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'49%'}}>
                                    <RHFDnd name="profilUsahaImages[8]" onDelete={()=>{handleDeletePreview(imageData[4]?.id)}} files={imageData[4] == undefined || imageData[4] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/profil/'+imageData[4]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'49%'}}>
                                    <RHFDnd name="profilUsahaImages[9]" onDelete={()=>{handleDeletePreview(imageData[4]?.id)}} files={imageData[4] == undefined || imageData[4] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/profil/'+imageData[4]?.path} control={control}></RHFDnd>
                                </Box>
                            </FormControl>
                            <Button variant="contained" color="success" sx={{width:'100%'}} type="submit">{editMode ? 'Simpan Perubahan' : 'Tambah Unit Usaha'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Typography variant="h3" fontWeight={400}>Profil Unit Usaha</Typography>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Button onClick={handleOpenAddForm} color="success" variant="contained" startIcon="">
                        Tambah Profil
                    </Button>
                </Box>
                <Card sx={{marginY:'1em'}}>
                    <TableContainer>
                        <Table>
                            <CustomTableHead tableHead={TABLEHEAD}></CustomTableHead>
                            <TableBody>
                                {
                                    profilUsahas === [] || profilUsahas==='' || profilUsahas === undefined ? (
                                        <TableRow>
                                            <TableCell>Data kosong</TableCell>
                                        </TableRow>
                                    ) :
                                    profilUsahas?.map((map)=>{
                                        return ( <>
                                            <ProfilUsahaTableRow 
                                            key={map.id} 
                                            onDelete={() => handleDelete(map.profil.id)} 
                                            onEdit={() => handleOpenEditForm(map)} 
                                            onShowImage={()=> handleShowImage(map.usahaImage)}
                                            num={++num} row={map}>

                                            </ProfilUsahaTableRow>
                                        </>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </AdminLayout>
        </>
    )
}