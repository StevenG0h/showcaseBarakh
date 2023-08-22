import axios from "../../../utils/axios";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
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
import  ChevronRight  from "@mui/icons-material/ChevronRight";
import  ChevronLeft  from "@mui/icons-material/ChevronLeft";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';

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
        console.log(UnitUsaha.data)
        return {
            props:{
                unitUsaha: UnitUsaha.data.data,
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
    let [loading, setLoading] = useState(false)
    let [profilUsahas, setprofilUsahas] = useState(unitUsaha.data);
    let [profilUsahasLink, setprofilUsahasLink] = useState(unitUsaha.links);
    let [imageData, setImage] = useState([]);
    let [deletedImage, setDeletedImage] = useState([]);
    let [imageBackup, setImageBackup] = useState([]);
    let [profileDesc, setProfileDesc] = useState("");
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);
    //Next router
    const router = useRouter();

    //React hook form and YUP validator
    // const schema = yup.object().shape({
    //     unit_usaha_id: yup.number(),
    //     profil_usaha_desc: yup.string().required('Deskripsi unit usaha tidak boleh kosong'),
    //     profilUsahaImages: yup.mixed().test("filesize", "Gambar tidak boleh kosong", (value) => {
    //         if(editMode == false){
    //             if(value[0] === undefined){
    //                 return false;
    //             }
    //             return true;
    //         }else{
    //             return true;
    //         }
    //       }),
    // })

    const { control, handleSubmit, getValues, setValue, reset, register , formState:{errors}} = useForm({
        defaultValues: {
            id: ''  ,
          unit_usaha_id:'',
          profil_usaha_desc: ""
        }
      })
    
      const onSubmit = async (data) => {
        let token = getCookie('token');
        console.log(profileDesc);
        setLoading(true);
        data.profil_usaha_desc = profileDesc
        if(data.id == ''){
            // data.profilUsahaImageFiltered = data.profilUsahaImages.map((image)=>{
            //     if(image?.isFile != false){
            //         return image
            //     }else{
            //         return undefined
            //     }
            // })
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                console.log(data);
                await axios.post('/api/admin/profil',data,{
                    headers: { Authorization: `Bearer `+token, "Content-Type":'multipart/form-data'},
                    withCredentials: true,
                }).then((r)=>{
                    console.log(r)
                    router.replace(router.asPath)
                }).catch((e)=>{
                    console.log(e);
                })
            }).catch((e)=>{
                console.log(e)
            })
        }else{
            // if(data.profilUsahaImages == ''){
            //     delete data.profilUsahaImages;
            // }
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true   
            }).then(async (r)=>{
                await  axios.post('/api/admin/profil/edit/'+data.id,data,{
                    headers: { Authorization: `Bearer `+token, "Content-Type":'multipart/form-data'},
                    withCredentials: true,
                }).then((r)=>{
                    console.log(r.data)
                    router.replace(router.asPath)
                }).catch((e)=>{
                    console.log(e);
                })
            }).catch((e)=>{
                console.log(e)
            })
            
        }
        handleCloseAddForm()
        router.replace(router.asPath)
        setLoading(false)
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
        setDeletedImage([])
        setProfileDesc("")
    }
    
    let handleOpenEditForm = (data)=>{
        setEditMode(true);
        if(data.profil != null){
            setValue('id',data?.profil?.id);
            setProfileDesc(data.profil?.profil_usaha_desc);
        }
        setValue('unit_usaha_id',data?.id);
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

    let handleChangePage = async (link)=>{
        if(link != null){
            let unitUsaha = await axios.get(link,{
                headers:{
                    Authorization: 'Bearer '+token,
                },
                withCredentials:true
            });
            setprofilUsahas(unitUsaha?.data?.data?.data)
            setprofilUsahasLink(unitUsaha?.data?.data?.links)
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

    useEffect(() => {
        setprofilUsahas(unitUsaha.data)
        setprofilUsahasLink(unitUsaha.links)
      }, [unitUsaha]);

      var myToolbar= [
        ['bold', 'italic', 'underline', 'strike'],       
        ['blockquote', 'code-block'],
    
        [{ 'color': [] }, { 'background': [] }],         
        [{ 'font': [] }],
        [{ 'align': [] }],
    
        ['clean'],                                        
        ['image'] //add image here
    ];

    return (
        <>
            <AdminLayout handleLoading={loading}>
                <Dialog open={AddForm} sx={{overflow:'hidden'}} onClose={handleCloseAddForm} fullWidth maxWidth='md'>
                    <DialogContent>
                        <Typography variant="h5" sx={{marginBottom:'1em'}} fontWeight={600}>Edit Profil</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <ReactQuill  style={{height:'500px'}} theme="snow" value={profileDesc} onChange={setProfileDesc} ></ReactQuill>
                            </FormControl>
                            {/* <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField hiddenLabel={false} label={'Deskripsi profil'} name={"profil_usaha_desc"} control={control}></RHFTextField>
                            </FormControl> */}
                            {/* <FormControl sx={{marginY:'0.5em',display:'flex', flexDirection:'row', flexWrap:'wrap', width:'99%',overflow:'hidden'}}>
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
                            </FormControl> */}
                            <Button variant="contained" color="success" sx={{width:'100%'}} type="submit">{editMode ? 'Simpan Perubahan' : 'Simpan Perubahan'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Typography variant="h3" color={'#94B60F'} sx={{textDecoration:'underline'}} fontWeight={400}>Profil Unit Usaha</Typography>
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
                    <Box sx={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                    {
                        profilUsahasLink.map((link)=>{
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