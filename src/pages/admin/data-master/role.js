import axios from "../../../utils/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import { Box, Button, Card, Dialog, DialogContent, FormControl, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Input, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import RHFTextField from "../../../components/form/RHFTextField";
import CustomTableHead from "../../../components/table/CustomTableHead";
import ProductTableRow from "../../../sections/product/ProductTableRow";
import  Delete  from "@mui/icons-material/Delete";
import  Star  from "@mui/icons-material/Star";
import RHFDnd from "../../../components/form/RHFDnd";
import {getCookie} from 'cookies-next';
import { getAllUnitUsaha } from "../../../helper/dataOptions";
import  ChevronRight  from "@mui/icons-material/ChevronRight";
import  ChevronLeft  from "@mui/icons-material/ChevronLeft";
import { useEffect } from "react";
import { checkPrivilege } from "../../../helper/admin";
import { ConfirmDialog } from "../../../components/dialog/ConfirmDialog";
import RoleTableRow from "../../../sections/role/RoleTableRow";
import RHFSelect from "../../../components/form/RHFSelect";

export async function getServerSideProps({req,res,query}){
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
    let admin = ''
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
        let produk = await axios.get('/api/admin/role',{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        return {
            props:{
                isSuper: admin.adminLevel == '1' ? true : false,
                admin: admin,
                product: produk.data
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

export default function product({isSuper,admin,unitUsaha,product}){
    let token = getCookie('token')
    let [loading, setLoading] = useState(false)
    let [products, setProducts] = useState(product.data);
    let [productsLink, setProductsLink] = useState(product.links);
    let [imageData, setImage] = useState([]);
    let [deletedImage, setDeletedImage] = useState([]);
    let [deleteProduct, setDeleteProduct] = useState('');
    //Next router
    const router = useRouter();

    //React hook form and YUP validator
    const schema = yup.object().shape({
        roleName: yup.string().required('Nama role tidak boleh kosong'),
    })

    const { control, handleSubmit, setValue, reset, register , formState:{errors}} = useForm({
        defaultValues: {
          id: ''  ,
          roleName: "",
          permission: ""
        },
        resolver: yupResolver(schema)
      })
    
      const onSubmit = async (data) => {
        setLoading(true)
        if(editMode == false){
            console.log(data)
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                await axios.post('/api/admin/role',data,{
                    headers: { Authorization: `Bearer `+token,
                    'Content-Type': 'multipart/form-data'
                    },  
                    withCredentials: true
                }).then((r)=>{
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
                await axios.post('/api/admin/role/edit/'+data.id,data,{
                    headers: { Authorization: `Bearer `+token,
                    'Content-Type': 'multipart/form-data'
                },
                    withCredentials: true
                }).then((r)=>{
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
        handleCloseAddForm()
      }
      
      //states
    const [AddForm, setAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    //handler
    async function handleDelete(id){
        
        const csrf = await axios.get('/sanctum/csrf-cookie').then(async(r)=>{
            const deleteProduct = await axios.delete('/api/admin/role/'+id,
            {headers:{
                Authorization: 'Bearer '+token
            },withCredentials:true});
        }).catch((e)=>{
            console.log(e);
        })
        setDeleteProduct('')
        router.replace(router.asPath)
    }

    //state handler
    let handleOpenAddForm = ()=>{
        setAddForm(true)
    }

    let handleCloseAddForm = ()=>{
        setEditMode(false);
        setAddForm(false);
        setValue('id','');
        setValue('roleName','');
        setValue('permission','');
    }
    
    let handleOpenEditForm = (data)=>{
        setEditMode(true);
        setValue('id',data.id);
        setValue('roleName',data.roleName);
        setValue('permission',data.permission);
        
        setAddForm(true)
    }

    let handleChangePage = async (link)=>{
        if(link != null){
            try{
                let unitUsaha = await axios.get(link,{
                    headers:{
                        Authorization: 'Bearer '+token,
                    },
                    withCredentials:true
                });
                console.log(unitUsaha.data)
                setProducts(unitUsaha?.data.product.data)
                setProductsLink(unitUsaha?.data.product.links)
            }catch(e){
                console.log(e)
            }
        }
    }

    //utils

    let TABLEHEAD = [
        {value: 'No',align: 'left'},
        {value: 'Nama Role',align: 'left'},
        {value: 'Action',align: 'center'},
    ]
    
    let num = 0;

    useEffect(() => {
        setProducts(product.data)
        setProductsLink(product.links)
      }, [product]);

    let PERMISSION = [
        {id: '1', label: 'Admin'},
        {id: '0', label: 'Operator'}
    ]

    return (
        <>
        <ConfirmDialog onCancel={()=>setDeleteProduct('')} msg={'Anda yakin ingin menghapus Role '+deleteProduct.roleName+" ?"} title={"Hapus Role"} open={deleteProduct != ''} onConfirm={()=>handleDelete(deleteProduct.id)}></ConfirmDialog>
            <AdminLayout isSuper={isSuper} admin={admin} handleLoading={loading}>
                <Dialog open={AddForm} sx={{overflow:'hidden'}} onClose={handleCloseAddForm} fullWidth maxWidth='xs'>
                    <DialogContent>
                        <Typography variant="h5" sx={{marginBottom:'1em'}} fontWeight={600}>Tambah Role</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField hiddenLabel={false} label={'Nama Role'} name={"roleName"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFSelect label={'Hak Akses'} option={PERMISSION} control={control} name={'permission'}></RHFSelect>
                            </FormControl>
                            <Button variant="contained" color="success" sx={{width:'100%'}} type="submit">{editMode ? 'Simpan Perubahan' : 'Tambah Produk'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Typography variant="h3" color={'#94B60F'} sx={{textDecoration:'underline'}} fontWeight={400}>Role</Typography>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginY:'1em'}}>
                    <Button onClick={handleOpenAddForm} color="success" variant="contained" startIcon="">
                        Tambah Role
                    </Button>
                </Box>
                <Card sx={{marginY:'1em'}}>
                    <TableContainer>
                        <Table>
                            <CustomTableHead tableHead={TABLEHEAD}></CustomTableHead>
                            <TableBody>
                                {
                                    products === [] || products==='' || products === undefined || products.length ===0 ? (
                                        <TableRow>
                                            <TableCell>Data kosong</TableCell>
                                        </TableRow>
                                    ) :
                                    products?.map((map)=>{
                                        return ( <>
                                            <RoleTableRow 
                                            key={map.id} 
                                            onDelete={() => setDeleteProduct(map)} 
                                            onEdit={() => handleOpenEditForm(map)} 
                                            num={++num} row={map}>

                                            </RoleTableRow>
                                        </>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                        {
                            productsLink.map((link,index)=>{
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