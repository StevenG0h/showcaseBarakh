import axios from "../../../utils/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import { Alert, Button, Card, Dialog, DialogContent, FormControl, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import RHFTextField from "../../../components/form/RHFTextField";
import CustomTableHead from "../../../components/table/CustomTableHead";
import UserTableRow from "../../../sections/user/UserTableRow";
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
        let user = await axios.get('/api/admin/admin',{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        return {
            props:{
                user: user.data,
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

export default function product({user}){
    let token = getCookie('token');
    let title = 'User';
    let [products, setProducts] = useState(user);
    let [formTitle, setFormTitle] = useState('');
    let [error, setError] = useState('');
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

    const { control, handleSubmit, setValue, reset, register , formState:{errors}} = useForm({
        defaultValues: {
          id:'',
          productStock:0,
          productPrice:0,
        },
        resolver: yupResolver(schema)
      })
    
      const onSubmit = async (data) => {
        
        if(editMode == false){
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                await axios.post('/api/admin/register',data,{
                    headers: { Authorization: `Bearer `+token,
                    'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }).then((r)=>{
                    console.log(r.data)
                    router.reload();
                }).catch((e)=>{
                    console.log(e);
                    setError(e.response.data.message)
                })
            }).catch((e)=>{
                console.log(e)
            })
        }else{
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                await axios.put('/api/admin/admin/'+data.id,data,{
                    headers: { Authorization: `Bearer `+token
                    },
                    withCredentials: true
                }).then((r)=>{
                    console.log(r.data)
                    router.reload();
                }).catch((e)=>{
                    console.log(e);
                    setError(e.response.data.message)
                })
            }).catch((e)=>{
                console.log(e)
            })
        }
      }
      
      //states
    const [AddForm, setAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);

    //state handler

    let handleOpenAddForm = ()=>{
        setEditMode(false);
        setAddForm(true);
    }
    let handleCloseAddForm = ()=>{
        setEditMode(false);
        setAddForm(false);
        setValue('id','');
        setValue('adminName','');
        setValue('adminNum','');
        setValue('email','');
    }
    
    let handleOpenEditForm = (data)=>{
        setEditMode(true);
        setValue('id',data.id);
        setValue('adminName',data.admins.adminName);
        setValue('adminNum',data.admins.adminNum);
        setValue('email',data.email);
        setFormTitle(data.productName);
        setAddForm(true)
    }

    let handleDelete = async (data)=>{
        await axios.get('/sanctum/csrf-cookie',{
            headers: { Authorization: `Bearer `+token},
            withCredentials: true
        }).then(async (r)=>{
            await axios.delete('/api/admin/admin/'+data,{
                headers: { Authorization: `Bearer `+token
                },
                withCredentials: true
            }).then((r)=>{
                console.log(r.data)
                router.reload()
            }).catch((e)=>{
                console.log(e);
            })
        }).catch((e)=>{
            console.log(e)
        })
    }
    //utils

    let TABLEHEAD = [
        {value: 'No',align: 'left'},
        {value: 'Nama',align: 'left'},
        {value: 'Email',align: 'left'},
        {value: 'Nomor Whatsapp',align: 'left'},
        {value: 'Level',align: 'left'},
        {value: 'Action',align: 'center'}
    ]
    
    let num = 0;

    return (
        <>
            <AdminLayout>
                <Dialog open={AddForm} onClose={handleCloseAddForm} fullWidth maxWidth='xs'>
                    <DialogContent>
                        <Typography variant="h5" sx={{marginBottom:'1em'}} fontWeight={600}>Edit Admin</Typography>
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
                            <Button variant="contained" color="success" sx={{width:'100%'}} type="submit">{editMode ? 'Simpan Perubahan' : 'Tambah Unit Usaha'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Typography variant="h3" fontWeight={400}>{title}</Typography>
                <Button onClick={()=>{handleOpenAddForm()}}>Tambah Admin</Button>
                <Card sx={{marginY:'1em'}}>
                    <TableContainer>
                        <Table>
                            <CustomTableHead tableHead={TABLEHEAD}></CustomTableHead>
                            <TableBody>
                                {
                                    products === [] || products==='' || products === undefined ? (
                                        <TableRow>
                                            <TableCell>Data kosong</TableCell>
                                        </TableRow>
                                    ) :
                                    products?.map((map)=>{
                                        return ( <>
                                            <UserTableRow 
                                            key={num} 
                                            onEdit={() => handleOpenEditForm(map)} 
                                            onDelete={()=>{handleDelete(map.id)}}
                                            num={++num} row={map}>

                                            </UserTableRow>
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