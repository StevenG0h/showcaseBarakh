import axios from "../../../utils/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import { Alert, Box, Button, Card, Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import RHFTextField from "../../../components/form/RHFTextField";
import RHFSelect from "../../../components/form/RHFSelect";
import RHFAutocomplete from "../../../components/form/RHFAutocomplete";
import CustomTableHead from "../../../components/table/CustomTableHead";
import UserTableRow from "../../../sections/user/UserTableRow";
import {getCookie} from 'cookies-next';

import  ChevronRight  from "@mui/icons-material/ChevronRight";
import  ChevronLeft  from "@mui/icons-material/ChevronLeft";
import { useEffect } from "react";
import { getAllRole, getAllUnitUsaha } from "../../../helper/dataOptions";
import { ConfirmDialog } from "../../../components/dialog/ConfirmDialog";
import { checkPrivilege } from "../../../helper/admin";

export async function getServerSideProps({req,res}){
    let token = getCookie('token',{req,res});
    let admin = '';
    if(token == undefined){
        return {
            redirect: {
              permanent: false,
              destination: "/auth",
            },
            props:{},
          };
    }

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
        let user = await axios.get('/api/admin/admin/detail/'+admin.user_id,{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        console.log(user)
        return {
            props:{
                isSuper: admin.adminLevel == '1' ? true : false,
                admin: admin,
                user: user.data
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

export default function product({user,options, isSuper, admin}){
    let [loading, setLoading] = useState(false)
    let token = getCookie('token');
    let title = 'Pegawai';
    let [products, setProducts] = useState(user);
    let [error, setError] = useState('');
    let [adminData, setAdminData] = useState('');
    let [filterActive, setActive] = useState(true);
    //Next router
    const router = useRouter();

    //React hook form and YUP validator
    const schema = yup.object().shape({
        id: yup.string(),
        adminName: yup.string().required('Nama tidak boleh kosong'),
        adminNum: yup.string().required('Nomor WhatsApp tidak boleh kosong'),
        email: yup.string().email().required('Email tidak boleh kosong'),
        password: yup.string(),
        password_confirmation : yup.string().oneOf([yup.ref('password')], 'Password Anda tidak cocok')
    })

    const { control, handleSubmit, setValue, getValues, reset, register , formState:{errors}} = useForm({
        defaultValues: {
          id:user.id,
          adminName: user.admins.adminName,
          adminNum: user.admins.adminNum,
          email: user.email,
          productPrice:0,
        },
        resolver: yupResolver(schema)
      })
    
      const onSubmit = async (data) => {
        let finalData = data;
        if(finalData.password == ''){
            delete finalData.password;
        }
        setLoading(true)
        if(editMode == false){
            console.log(finalData)
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                await axios.post('/api/admin/register',finalData,{
                    headers: { Authorization: `Bearer `+token,
                    'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }).then((r)=>{
                    console.log(r.data)
                    router.replace(router.asPath)
                    handleCloseAddForm()
                }).catch((e)=>{
                    console.log(e);
                    setError(e.response.data.message)
                })
            }).catch((e)=>{
                console.log(e)
            })
        }else{
            console.log(finalData)
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                await axios.put('/api/admin/admin/'+data.id,finalData,{
                    headers: { Authorization: `Bearer `+token
                    },
                    withCredentials: true
                }).then((r)=>{
                    console.log(r.data)
                    router.replace(router.asPath)
                }).catch((e)=>{
                    console.log(e);
                    setError(e.response.data.message)
                })
            }).catch((e)=>{
                console.log(e)
            })
        }
        setLoading(false)
        
      }
      
      //states
    const [editMode, setEditMode] = useState(true);

    //state handler

    //utils
    

    let num = 0;

    useEffect(() => {
        setEditMode(true);
        setValue('id',user.id);
        setValue('adminName',user.admins.adminName);
        setValue('adminNum',user.admins.adminNum);
        setValue('email',user.email);
      }, [user]);

    return (
        <>
            <ConfirmDialog onConfirm={()=>handleDelete(adminData.id)} onCancel={()=>{setAdminData('')}} open={adminData != ''} msg={'Anda yakin ingin menonaktifkan '+adminData?.admins?.adminName+' ?'}></ConfirmDialog>
            <AdminLayout isSuper={isSuper} admin={admin} handleLoading={loading}>
                <Box maxWidth={'sm'}>

                    <Card>
                            <Typography variant="h5" sx={{marginBottom:'1em'}} fontWeight={600}>{editMode == true ? 'Edit' : 'Tambah'} Pegawai</Typography>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {
                                    error != '' ?
                                    <Alert color="error">
                                        {error}
                                    </Alert>
                                    : ''
                                }
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
                                <Button variant="contained" color="success" sx={{width:'100%'}} type="submit">{editMode ? 'Simpan Perubahan' : 'Tambah Pegawai'}</Button>
                            </form>
                    </Card>
                </Box>
            </AdminLayout>
        </>
    )
}