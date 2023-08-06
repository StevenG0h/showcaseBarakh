import axios from "../../../utils/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import { Box, Button, Card, Chip, Dialog, DialogContent, FormControl, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Input, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import RHFTextField from "../../../components/form/RHFTextField";
import CustomTableHead from "../../../components/table/CustomTableHead";
import { getAllUnitUsaha } from "../../../helper/dataOptions";
import StockTableRow from "../../../sections/stock/StockTableRow";
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
        let produk = await axios.get('/api/admin/produk',{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        let unitusaha = await getAllUnitUsaha();
        return {
            props:{
                produk: produk.data.data,
                options:{
                    unitUsaha: unitusaha
                }
            }
        }
    }catch(e){
        console.log(e)
        // return {
        //     redirect: {
        //       permanent: false,
        //       destination: "/auth",
        //     },
        //     props:{},
        //   };
    }
}

export default function product({produk, options}){
    let [loading, setLoading] = useState(false)
    let title = 'Stock';
    const token = getCookie('token');
    let [products, setProducts] = useState(produk.data);
    let [productsLink, setProductsLink] = useState(produk.links);
    let [formTitle, setFormTitle] = useState('');
    let [activeLink, setActiveLink] = useState('*');
    //Next router
    const router = useRouter();

    //React hook form and YUP validator
    const schema = yup.object().shape({
        id: yup.string().required('Something wrong'),
        productPrice: yup.number().required('Harga tidak boleh kosong').min(1),
        productStock: yup.number().required('Stok tidak boleh kosong').min(1),
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
        setLoading(true)
        if(editMode == true){
            handleCloseAddForm();
            await axios.get('/sanctum/csrf-cookie', {
                headers:{token: 'Bearer '+token},
                withCredentials: true
            }).then(async (r)=>{
                await axios.post('/api/admin/produk/edit/'+data.id,data,{
                    headers: { Authorization: `Bearer `+token,
                    'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }).then((r)=>{
                    console.log(r.data)
                }).catch((e)=>{
                    console.log(e);
                })
            })
            
        }
        router.replace(router.asPath);
        setLoading(false)
      }
      
      //states
    const [AddForm, setAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);

    //state handler
    let handleChangeFilter = async (data)=>{
        setActiveLink(data);
        if(data != '*'){
            let unitUsaha = await axios.get('/api/admin/produk/withFilter/'+data, {
                headers:{
                    Authorization: 'Bearer '+token
                },
                withCredentials:true
            });
            setProducts(unitUsaha?.data?.data)
            setProductsLink(unitUsaha?.data.data.links)
        }else{
            let unitUsaha = await axios.get('/api/admin/produk/', {
                headers:{
                    Authorization: 'Bearer '+token
                },
                withCredentials:true
            });
            setProducts(unitUsaha?.data.data.data)
            setProductsLink(unitUsaha?.data.data.links)
        }   
    }

    let handleCloseAddForm = ()=>{
        setEditMode(false);
        setAddForm(false);
        setValue('id','');
        setValue('productStock',0);
        setValue('productPrice',0);
        reset({
            productStock:0,
            productPrice:0
        });
    }
    
    let handleOpenEditForm = (data)=>{
        setEditMode(true);
        setValue('id',data.id);
        setValue('productStock',data.productStock);
        setValue('productPrice',data.productPrice);
        setFormTitle(data.productName);
        setAddForm(true)
    }
    //utils

    let handleChangePage = async (link)=>{
        if(link != null){
            let unitUsaha = await axios.get(link,{
                headers:{
                    Authorization: 'Bearer '+token,
                },
                withCredentials:true
            });
            setProducts(unitUsaha?.data?.data?.data)
            setProductsLink(unitUsaha?.data?.data?.links)
        }
    }

    let TABLEHEAD = [
        {value: 'No',align: 'left'},
        {value: 'Nama produk',align: 'left'},
        {value: 'Harga',align: 'left'},
        {value: 'Stok',align: 'left'},
        {value: 'Action',align: 'left'}
    ]
    
    let num = 0;

    useEffect(() => {
        setProducts(produk.data)
        setProductsLink(produk.links)
      }, [produk]);

    return (
        <>
            <AdminLayout handleLoading={loading}>
                <Dialog open={AddForm} onClose={handleCloseAddForm} fullWidth maxWidth='xs'>
                    <DialogContent>
                        <Typography variant="h5" sx={{marginBottom:'1em'}} fontWeight={600}>Edit Stok</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Typography>
                                Nama produk: {formTitle}
                            </Typography>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField type="number" hiddenLabel={false} label={'Stok'} name={"productStock"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField type="number" hiddenLabel={false} label={'Harga'} name={"productPrice"} control={control}></RHFTextField>
                            </FormControl>
                            <Button variant="contained" color="success" sx={{width:'100%'}} type="submit">{editMode ? 'Simpan Perubahan' : 'Tambah Unit Usaha'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Typography variant="h3" color={'#94B60F'} fontWeight={400} sx={{textDecoration:'underline'}}>{title}</Typography>
                <Box sx={{display:'flex', gap:'1em', marginY:'1em', flexDirection:'row'}}>
                    <Typography variant="h6" sx={{margin:0}}>
                        Unit Usaha:
                    </Typography>
                    <Button color="success" variant={activeLink === '*' ? 'contained' : 'outlined'} sx={{borderRadius:'5em'}} onClick={()=>{handleChangeFilter('*')}}>Semua</Button>
                    {
                        options.unitUsaha.map((unitUsaha)=>{
                            return (
                                <Button color="success" variant={activeLink === unitUsaha.id ? 'contained' : 'outlined'} sx={{borderRadius:'5em'}} onClick={()=>{handleChangeFilter(unitUsaha.id)}}>{unitUsaha.label}</Button>
                            )
                        })
                    }
                </Box>
                <Card sx={{marginY:'1em'}}>
                    <TableContainer>
                        <Table>
                            <CustomTableHead tableHead={TABLEHEAD}></CustomTableHead>
                            <TableBody>
                                {
                                    products?.length === 0 || products === [] || products === undefined ? (
                                        <TableRow>
                                            <TableCell>Data kosong</TableCell>
                                        </TableRow>
                                    ) :
                                    products?.map((map)=>{
                                        return ( <>
                                            <StockTableRow 
                                            key={num} 
                                            onEdit={() => handleOpenEditForm(map)} 
                                            num={++num} row={map}>

                                            </StockTableRow>
                                        </>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                    {
                        productsLink.map((link)=>{
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