import axios from "../../../utils/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import { Box, Button, Card, Chip, Dialog, DialogContent, FormControl, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Input, InputBase, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import RHFTextField from "../../../components/form/RHFTextField";
import CustomTableHead from "../../../components/table/CustomTableHead";
import { getAllUnitUsaha, getAllUnitUsahaAdmin } from "../../../helper/dataOptions";
import StockTableRow from "../../../sections/stock/StockTableRow";
import {getCookie} from 'cookies-next';
import  ChevronRight  from "@mui/icons-material/ChevronRight";
import  ChevronLeft  from "@mui/icons-material/ChevronLeft";
import { useEffect } from "react";
import { checkPrivilege } from "../../../helper/admin";
import  Search  from "@mui/icons-material/Search";

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
        console.log('admin',admin)
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
        let produk = await axios.get('/api/admin/produk',{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        let unitusaha = await getAllUnitUsahaAdmin(token);
        return {
            props:{
                isSuper: admin.adminLevel == '1' ? true : false,
                admin: admin,
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

export default function product({isSuper,admin,produk, options}){
    let [loading, setLoading] = useState(false)
    let title = 'Stock';
    const token = getCookie('token');
    let [products, setProducts] = useState(produk.data);
    let [productsLink, setProductsLink] = useState(produk.links);
    let [formTitle, setFormTitle] = useState('');
    let [search, setSearch] = useState({
        id:'all',
        orderBy:'desc',
        keyword:'',
        harga:''
    });
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
        let unitUsaha = await axios.post('/api/produk/search',data);
        setProducts(unitUsaha?.data?.data)
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
            <AdminLayout isSuper={isSuper} admin={admin} handleLoading={loading}>
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
                <Box sx={{display:'flex', gap:'1em', marginY:'1em', flexDirection:'row',flexWrap:'wrap'}}>
                    <Typography variant="h6" sx={{margin:0}}>
                        Unit Usaha:
                    </Typography>
                    <Button color="success" variant={search.id === 'all' ? 'contained' : 'outlined'} sx={{borderRadius:'5em'}} 
                    onClick={()=>{
                        let searchData = search;
                        searchData.id = 'all';
                        setSearch(searchData);
                        handleChangeFilter(searchData);
                    }}>Semua</Button>
                    {
                        options.unitUsaha.map((unitUsaha)=>{
                            return (
                                <Button color="success" variant={search.id === unitUsaha.id ? 'contained' : 'outlined'} sx={{borderRadius:'5em'}} onClick={()=>{let searchData = search;
                                    searchData.id = unitUsaha.id;
                                    setSearch(searchData);
                                    handleChangeFilter(searchData);}}>{unitUsaha.label}</Button>
                            )
                        })
                    }
                </Box>
                <Box sx={{display:'flex', gap:'1em', alignItems:'start', justifyContent:'space-between',flexDirection:{
                            lg:'row',
                            xs:'column'
                        }}}>
                        <Card sx={{width:{
                                lg:'30%',
                                xs:'100%'
                            },borderRadius:'5em',display:'flex',flexDirection:'row',justifyContent:'stretch'}}>
                            <FormControl sx={{backgroundColor:'white',width:'100%'}}>
                                <InputBase placeholder="ketik untuk mencari produk" defaultValue={search.keyword} onChange={(e)=>{
                                    let data = search;
                                    data.keyword =e.target.value;
                                    setSearch(data);
                                }} sx={{borderRadius:'5em', paddingY:'0.5em',width:'100%',outline:'none',"& fieldset": { border: 'none' },paddingLeft:'1em'}}>
                                
                                </InputBase>
                            </FormControl>
                            <IconButton onClick={()=>handleChangeFilter(search)} variant="contained" color="success" sx={{height:'100%',paddingY:'0.5em', borderRadius:'0'}}>
                                <Search></Search>
                            </IconButton>
                        </Card>
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