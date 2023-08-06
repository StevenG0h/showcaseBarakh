import CustomTableHead from "../../../components/table/CustomTableHead"
import AdminLayout from "../../../layouts/adminLayout/AdminLayout"
import UsahaTableRow from "../../../sections/UnitUsaha/UsahaTableRow";
import {Alert, Box, Button, Card, Dialog, DialogContent, DialogTitle, FormControl, Input, MenuItem, MenuList, Select, Table, TableBody, TableContainer, TextField, Typography } from "@mui/material"
import axios from "../../../utils/axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import RHFTextField from "../../../components/form/RHFTextField";
import RHFDnd from "../../../components/form/RHFDnd";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import {getCookie} from 'cookies-next';
import  ChevronRight  from "@mui/icons-material/ChevronRight";
import  ChevronLeft  from "@mui/icons-material/ChevronLeft";
import { useEffect } from "react";

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
        let UnitUsaha = await axios.get('/api/admin/unit-usaha',{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        console.log(UnitUsaha.data.data);
        return {
            props: {
                data: UnitUsaha?.data?.data
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

export default function admin({data}){
    let [loading, setLoading] = useState(false)
    let [unitUsaha, setUnitUsaha] = useState(data.data);
    let [unitUsahaLink, setUnitUsahaLink] = useState(data.links);
    let [error, setError] = useState('');
    //Next router
    const router = useRouter();
    const [editMode, setEditMode] = useState(false);

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
          }),
          adminName: yup.string().when([],{
            is: editMode == false,
            then: ()=>{
                yup.string().required('Nama tidak boleh kosong')
            }
          }),
          adminNum: yup.string().when([],{
            is: editMode == false,
            then: ()=>{
                yup.string().required('Nomor WhatsApp tidak boleh kosong')
            },
          }),
          email: yup.string().when([],{
            is: editMode == false,
            then: ()=>{
                yup.string().email().required('Email tidak boleh kosong')
            },
          }),
          password: yup.string().when([],{
            is: editMode == false,
            then: ()=>{
                yup.string().min('Password minimal 8 Karakter')
            }
          }),
          password_confirmation: yup.string().when([],{
            is: ()=>editMode == false,
            then: ()=>{
                yup.string().oneOf([yup.ref('password')], 'Password Anda tidak cocok')
            },
          }),
    })

    const { control, handleSubmit, setValue,getValues, reset, register , formState:{errors}} = useForm({
        defaultValues: {
          usahaName: "",
          usahaDesc: "",
          usahaImage: "",
          usahaPicNumber: "",

        },
        resolver: yupResolver(schema)
      })
    
      const onSubmit = async (data) => {
        let token = getCookie('token');
        setLoading(true)
        
        console.log(data)
        if(!editMode){
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                let unitUsaha = await axios.post('/api/admin/unit-usaha/',data,{
                    headers: { Authorization: `Bearer `+token,'Content-Type': 'multipart/form-data'},
                    withCredentials: true
                }).then((r)=>{
                    console.log(r.data)
                    setError('')
                }).catch((e)=>{
                    console.log(e);
                    setError(e.response.data.message)
                })
                handleCloseAddForm()
            }).catch((e)=>{
                console.log(e)
                setError(e.response.data.message)
            })
        }else{
            console.log(data);

            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                await axios.post('/api/admin/unit-usaha/'+usahaId,data,{
                    headers: { Authorization: `Bearer `+token,'Content-Type': 'multipart/form-data'},
                    withCredentials: true
                }).then((r)=>{
                    console.log(r.data)
                    setError('')
                }).catch((e)=>{
                    console.log(e);
                    setError(e.response.data.message)
                })
                handleCloseAddForm()
            }).catch((e)=>{
                console.log(e)
                setError(e.response.data.message)
            })
        }
        router.replace(router.asPath)
        setLoading(false)
      }
      
      //states
    const [showImage, setShowImage] = useState('');
    const [AddForm, setAddForm] = useState(false);
   
    const [usahaId, setUsahaId] = useState('');
    
    //handler
    async function handleDelete(id){
        let token = getCookie('token');
        console.log(token)
        await axios.get('/sanctum/csrf-cookie',{
            headers: { Authorization: `Bearer `+token},
            withCredentials: true
        }).then(async (r)=>{
            await axios.delete('/api/admin/unit-usaha/'+id,{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then((r)=>{
                console.log(r.data)
                router.replace(router.asPath)
            }).catch((e)=>{
                console.log(e);
            })
        }).catch((e)=>{
            console.log(e)
        })
        // router.reload()
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
            usahaPicNumber:'',
            usahaImage:''
        });
    }
    
    let handleOpenEditForm = (data)=>{
        setEditMode(true);
        setValue('usahaName',data.usahaName);
        setValue('usahaDesc',data.usahaDesc);
        setValue('usahaImage',data.usahaImage)
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
        setUnitUsaha(unitUsaha?.data?.data)
        setUnitUsahaLink(unitUsaha?.data.links)
    }

    //utils

    let TABLEHEAD = [
        {value: 'No',align: 'left'},
        // {value: 'Dibuat pada',align: 'left'},
        {value: 'Nama unit usaha',align: 'left'},
        {value: 'Deskripsi',align: 'left'},
        {value: 'Jumlah Produk',align: 'left'},
        {value: 'Gambar',align: 'left'},
        {value: 'Action',align: 'center'}
    ]
    
    let num = 0;

    useEffect(() => {
        setUnitUsaha(data.data)
        setUnitUsahaLink(data.links)
      }, [data]);

    return (
        <>
            <AdminLayout handleLoading={loading}>
                <Dialog open={showImage != ''} onClose={handleCloseShowImage} fullWidth maxWidth={'md'}>
                        <img height={"100%"} style={{objectFit:'contain'}} src={showImage}></img>
                </Dialog>
                <Dialog open={AddForm} onClose={handleCloseAddForm} fullWidth maxWidth='xs'>
                    <DialogContent>
                        <Typography variant="h5" sx={{marginBottom:'1em'}} fontWeight={600}>{
                            editMode == false ? 'Tambah' : 'Edit'
                        } Unit Usaha</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {
                                error != '' ?
                                <Alert color="error">
                                    {error}
                                </Alert>
                                : ''
                            }
                            <Typography variant="h6" sx={{borderBottom:'1px solid black', paddingBottom:'0.5em'}}>
                                Data Unit Usaha
                            </Typography>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField hiddenLabel={false} label={'Nama Unit Usaha'} name={"usahaName"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField hiddenLabel={false} label={'Deskripsi Unit Usaha'} name={"usahaDesc"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFDnd control={control} name={'usahaImage'} files={process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/unitUsaha/'+getValues('usahaImage')}>
                                    
                                </RHFDnd>
                            </FormControl>
                            {
                                editMode == false ? (
                                    <>
                                        <Typography variant="h6" sx={{borderBottom:'1px solid black', paddingBottom:'0.5em',marginTop:'1em'}}>
                                            Data Admin
                                        </Typography>

                                        <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                            <RHFTextField hiddenLabel={false} label={'Nama'} name={"adminName"} control={control}></RHFTextField>
                                        </FormControl>
                                        <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                            <RHFTextField hiddenLabel={false} label={'Nomor Whatsapp'} name={"adminNum"} control={control}></RHFTextField>
                                        </FormControl>
                                        <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                            <RHFTextField hiddenLabel={false} label={'Email'} name={"email"} control={control}></RHFTextField>
                                        </FormControl>
                                        <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                            <RHFTextField type={'password'} hiddenLabel={false} label={'Password'} name={"password"} control={control}></RHFTextField>
                                        </FormControl>
                                        <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                            <RHFTextField type={'password'} hiddenLabel={false} label={'Ketik Ulang Password'} name={"password_confirmation"} control={control}></RHFTextField>
                                        </FormControl>
                                    </>
                                ) : ''
                            }
                            
                            <Button variant="contained" color="success" sx={{width:'100%'}} type="submit">{editMode ? 'Simpan Perubahan' : 'Tambah Unit Usaha'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Typography variant="h3" color={'#94B60F'} sx={{textDecoration:'underline'}} fontWeight={400}>Unit Usaha</Typography>
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
                    <Button onClick={handleOpenAddForm} color="success" variant="contained" startIcon="" sx={{marginY:'1em'}}>
                        Tambah Unit Usaha
                    </Button>
                </Box>
                <Card sx={{marginY:'1em'}}>
                    <TableContainer>
                        <Table>
                            <CustomTableHead tableHead={TABLEHEAD}></CustomTableHead>
                            <TableBody sx={{width:'100%'}}>
                                {
                                    unitUsaha === [] || unitUsaha==='' || unitUsaha === undefined ? 'data kosong' :
                                    unitUsaha?.map((map)=>{
                                        return (
                                            <UsahaTableRow key={map.id} 
                                            onDelete={() => handleDelete(map.id)} 
                                            onEdit={() => handleOpenEditForm(map)} 
                                            onShowImage={()=> handleShowImage(map.usahaImage)}
                                            num={++num} row={map}
                                            >
                                            </UsahaTableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                        {
                            unitUsahaLink.map((link)=>{
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