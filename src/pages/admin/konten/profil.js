import axios from "../../../utils/axios";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import { Box, Button, Card, Dialog, DialogContent, FormControl, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Input, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import CustomTableHead from "../../../components/table/CustomTableHead";
import ProfilUsahaTableRow from "../../../sections/profilUsaha/ProfilUsahaTableRow";
import {getCookie} from 'cookies-next';
import  ChevronRight  from "@mui/icons-material/ChevronRight";
import  ChevronLeft  from "@mui/icons-material/ChevronLeft";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';
import { checkPrivilege } from "../../../helper/admin";

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
    let admin = '';
await checkPrivilege(token).then((r)=>{
        admin = r;
    }).catch((e)=>{
        console.log(e)
        return {
            redirect: {
                permanent: false,
                destination: "/auth",
            },
            props:{},
        };
    });
    try{
        let UnitUsaha = await axios.get('/api/admin/profil',{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        return {
            props:{
                isSuper: admin.adminLevel == '1' ? true : false,
                admin: admin,
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

export default function profil({isSuper,admin,unitUsaha,option}){
    let [loading, setLoading] = useState(false)
    let [profilUsahas, setprofilUsahas] = useState(unitUsaha.data);
    let [profilUsahasLink, setprofilUsahasLink] = useState(unitUsaha.links);
    let [imageData, setImage] = useState([]);
    let [deletedImage, setDeletedImage] = useState([]);
    let [imageBackup, setImageBackup] = useState([]);
    let [profileDesc, setProfileDesc] = useState("");
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);

    const router = useRouter();

    const { control, handleSubmit, getValues, setValue, reset, register , formState:{errors}} = useForm({
        defaultValues: {
            id: ''  ,
          unit_usaha_id:'',
          profil_usaha_desc: ""
        }
      })
    
      const onSubmit = async (data) => {
        let token = getCookie('token');
        setLoading(true);
        data.profil_usaha_desc = profileDesc
        if(data.id == ''){
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
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
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true   
            }).then(async (r)=>{
                await  axios.post('/api/admin/profil/edit/'+data.id,data,{
                    headers: { Authorization: `Bearer `+token, "Content-Type":'multipart/form-data'},
                    withCredentials: true,
                }).then((r)=>{
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
            <AdminLayout isSuper={isSuper} admin={admin} handleLoading={loading}>
                <Dialog open={AddForm} sx={{overflow:'hidden'}} onClose={handleCloseAddForm} fullWidth maxWidth='md'>
                    <DialogContent>
                        <Typography variant="h5" sx={{marginBottom:'1em'}} fontWeight={600}>Edit Profil</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <ReactQuill  style={{height:'500px'}} theme="snow" value={profileDesc} onChange={setProfileDesc} ></ReactQuill>
                            </FormControl>
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