import axios from "../../../utils/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import { Button, Card, Dialog, DialogTitle, DialogContent, FormControl, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Input, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from "@mui/material";
import RHFTextField from "../../../components/form/RHFTextField";
import RHFAutocomplete from "../../../components/form/RHFAutocomplete";
import CustomTableHead from "../../../components/table/CustomTableHead";
import { getAllUnitUsaha, getAllUnitUsahaAdmin, getAllUnitUsahaProduct } from "../../../helper/dataOptions";
import PenjualanTableRow from "../../../sections/penjualan/PenjualanTableRow";
import DetailPenjualanTableRow from "../../../sections/penjualan/DetailPenjualanTableRow";
import {getCookie} from 'cookies-next';
import  ChevronRight  from "@mui/icons-material/ChevronRight";
import  ChevronLeft  from "@mui/icons-material/ChevronLeft";
import { useEffect } from "react";
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
        console.log('admin',admin)
    }).catch((e)=>{
        console.log(e)
        return {
            redirect: {
                permanent: false,
                destination: "/auth",
            },
            props:{
            isSuper: admin.adminLevel == '1' ? true : false,
            admin: admin,},
        };
    });
   
    try{
        let produk = await axios.get('/api/admin/transaksi/penjualan',{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        })
        console.log(produk)
        let unitusaha = await getAllUnitUsahaAdmin(token);
            produk = produk.data
    
        return {
            props:{
                isSuper: admin.adminLevel == '1' ? true : false,
                admin: admin,
                produk: produk,
                options:{
                    unitUsaha: unitusaha
                }
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

export default function product({isSuper,admin,produk, options}){
    let [loading, setLoading] = useState(false)
    let token = getCookie('token');
    let title = 'Stock';
    let [products, setProducts] = useState(produk.data);
    let [productsLink, setProductsLink] = useState(produk.links);
    let [transaction, setTransaction] = useState([]);
    let [formTitle, setFormTitle] = useState([]);
    let [addDetailTransactionForm, setAddDetailTransactionForm] = useState('');
    let [productOption, setProductOptions] = useState([]);
    let [activeLink, setActiveLink] = useState('*');
    //Next router
    const router = useRouter();

    //React hook form and YUP validator
    const schema = yup.object().shape({
        id: yup.string().required('Something wrong'),
        productCount: yup.number().required('Harga tidak boleh kosong').min(1),

    })

    const { control, handleSubmit, setValue, reset, register , formState:{errors}} = useForm({
        defaultValues: {
          id:'',
          productCount:0,
        },
        resolver: yupResolver(schema)
      })
    
      const schemaAddSalesTransaction = yup.object().shape({
        productCount: yup.number().required('Harga tidak boleh kosong').min(1),
        usaha_id: yup.string().required('test'),
        product_id: yup.string().required('test'),
    })

    const { control: salesTransactionControl, handleSubmit: handleSalesTransactionSubmit, setValue: setSalesTransactionValue ,formState:{errors: salesTransactionError}} = useForm({
        defaultValues: {
          transaction_id:'',
          productCount:0,
          productPrice:0,
          usaha_id:'',
          product_id:''
        },
        resolvAuthorizationer: yupResolver(schemaAddSalesTransaction)
      })
    
      const onSubmit = async (data) => {
        setLoading(true)
        try{
            await axios.get('/sanctum/csrf-cookie',{
                withCredentials:true
            }).then(async(r)=>{
                const createproduk = await axios.put('/api/admin/penjualan/'+data.id,data,
                {
                    headers:{Authorization:"Bearer "+token},
                    withCredentials:true
                });
                handleCloseAddForm()
            })
        }catch(e){
            console.log(e)
        }finally{
            router.replace(router.asPath)
            setLoading(false)
        }
      }

      const onSalesTransactionSubmit = async (data) => {
        data.transactionAddress = addDetailTransactionForm.sales[0].transactionAddress
        data.client_id = addDetailTransactionForm.sales[0].client_id
        data.kelurahan_id = addDetailTransactionForm.sales[0].kelurahan_id
        data.kecamatan_id = addDetailTransactionForm.sales[0].kecamatan_id
        data.kota_id = addDetailTransactionForm.sales[0].kota_id
        data.provinsi_id = addDetailTransactionForm.sales[0].provinsi_id
        data.transactionAmount = Number(data.productPrice) * data.productCount;
        try{
            await axios.get('/sanctum/csrf-cookie',{
                withCredentials:true
            }).then(async(r)=>{
                let createSalesTransaction = await axios.post('/api/admin/penjualan',data,
                {
                    headers:{Authorization:"Bearer "+token},
                    withCredentials:true
                }).catch(e=>{
                    
                });
            })
            handleCloseAddForm()
        }catch(e){
            console.log(e)
        }finally{
            handleCloseAddSalesTransactionForm()
            router.replace(router.asPath)
        }
      }
      
      //states
    const [AddForm, setAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);

    

    //state handler
    let handleChangeFilter = async (data)=>{
        setActiveLink(data);
        if(data != '*'){
            let unitUsaha = await axios.get('/api/admin/transaksi/penjualan/'+data, {
                headers:{
                    Authorization: 'Bearer '+token
                },
                withCredentials:true
            });
            setProducts(unitUsaha?.data?.data)
            setProductsLink(unitUsaha?.data.links)
        }else{
            let unitUsaha = await axios.get('/api/admin/transaksi/penjualan', {
                headers:{
                    Authorization: 'Bearer '+token
                },
                withCredentials:true
            });
            setProducts(unitUsaha?.data?.data)
            setProductsLink(unitUsaha?.data.links)
        }   
    }

    let handleCloseAddForm = ()=>{
        setEditMode(false);
        setAddForm(false);
        setValue('id','');
        setValue('productCount',0);
    }
    
    let handleOpenEditForm = (data)=>{
        setEditMode(true);
        setValue('id',data.id);
        setValue('productCount',data.productCount);
        setAddForm(true)
    }
    //utils

    let handleTransactionDetails = (data)=>{
        setTransaction(data)
    }

    let handleCloseTransactionDetails = ()=>{
        setTransaction([])
        detailNum = 0;
    }

    let handleDeleteDetailRow =async (data)=>{

            try{
                await axios.get('/sanctum/csrf-cookie',{
                    withCredentials:true
                }).then(async(r)=>{
                    let createSalesTransaction = await axios.delete('/api/admin/penjualan/'+data.id,
                    {
                        headers:{Authorization:"Bearer "+token},
                        withCredentials:true
                    });
                })
            }catch(e){
                console.log(e)
            }finally{
                handleCloseAddSalesTransactionForm()
                router.replace(router.asPath)
            }
    }

    let handleAddSalesTransactionForm = (data)=>{
        setAddDetailTransactionForm(data)
        setSalesTransactionValue('transaction_id',data.id)
    }
    
    let handleCloseAddSalesTransactionForm = ()=>{
        setAddDetailTransactionForm([])
        setSalesTransactionValue('transaction_id','')
    }

    let handleProductOption = async (id)=>{
        let products = await getAllUnitUsahaProduct(id)
        console.log(products)
        setProductOptions(products);
    }

    let handleChangePage = async (link)=>{
        if(link != null){
            let unitUsaha = await axios.get(link,{
                headers:{
                    Authorization: 'Bearer '+token,
                },
                withCredentials:true
            });
            setProducts(unitUsaha?.data?.data)
            setProductsLink(unitUsaha?.data?.links)
        }
    }

    let TABLEHEAD = [
        {value: 'No',align: 'left'},
        {value: 'Nama Client',align: 'left'},
        {value: 'Alamat',align: 'left'},
        {value: 'Tanggal', align:'left'},
        {value: 'Total', align:'left'},
        {value: 'Status',align: 'left'},
        {value: 'Action',align: 'left'}
    ]
    
    let num = 0;
    let detailNum = 0;

    useEffect(() => {
        setProducts(produk.data)
        setProductsLink(produk.links)
        produk.data.map((data)=>{
            if(data.id == transaction.id){
                setTransaction(data)
            }
        })
      }, [produk]);

    return (
        <>
            <AdminLayout isSuper={isSuper} admin={admin} handleLoading={loading}>
            <Typography variant="h3" color={'#94B60F'} sx={{textDecoration:'underline'}} fontWeight={400}>Penjualan</Typography>
            <Box sx={{display:'flex', gap:'1em', marginY:'1em', flexDirection:'row', flexWrap:'wrap'}}>
            <Typography variant="h6" sx={{margin:0}}>
                Status:
            </Typography>
                <Button color="success" variant={activeLink === '*' ? 'contained' : 'outlined'} sx={{borderRadius:'5em'}} onClick={()=>{handleChangeFilter('*')}}>Semua</Button>
                <Button color={"error"} variant={activeLink === 'BELUMTERVERIFIKASI' ? 'contained' : 'outlined'} sx={{borderRadius:'5em'}} onClick={()=>{handleChangeFilter('BELUMTERVERIFIKASI')}}>Belum Terverifikasi</Button>
                <Button color="info" variant={activeLink === 'TERVERIFIKASI' ? 'contained' : 'outlined'} sx={{borderRadius:'5em'}} onClick={()=>{handleChangeFilter('TERVERIFIKASI')}}>Terverifikasi</Button>
                <Button color="warning" variant={activeLink === 'PENGIRIMAN' ? 'contained' : 'outlined'} sx={{borderRadius:'5em'}} onClick={()=>{handleChangeFilter('PENGIRIMAN')}}>Pengiriman</Button>
                <Button color="success" variant={activeLink === 'SELESAI' ? 'contained' : 'outlined'} sx={{borderRadius:'5em'}} onClick={()=>{handleChangeFilter('SELESAI')}}>Selesai</Button>
                <Button color="error" variant={activeLink === 'BATAL' ? 'contained' : 'outlined'} sx={{borderRadius:'5em'}} onClick={()=>{handleChangeFilter('BATAL')}}>BATAL</Button>
            </Box>
                {/* <Typography variant="h3" fontWeight={400}>{title}</Typography>
                <Select defaultValue={'*'}
                onChange={(e)=>handleChangeFilter(e.target.value)}
                >
                    <MenuItem value={'*'}>Semua</MenuItem>
                    {
                        options.unitUsaha.map((unitUsaha)=>{
                            return (
                                <MenuItem value={unitUsaha.id}>{unitUsaha.label}</MenuItem>
                            )
                        })
                    }
                </Select> */}
                <Dialog maxWidth={'xs'} fullWidth onClose={handleCloseAddSalesTransactionForm} open={addDetailTransactionForm.length === 0 ? false : true}>
                    <DialogTitle>
                        Tambah Transaksi
                    </DialogTitle>
          
                    <DialogContent>
                        <form onSubmit={handleSalesTransactionSubmit(onSalesTransactionSubmit)}>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFAutocomplete
                                    label={'Unit usaha'}
                                    name={'usaha_id'}
                                    options={options.unitUsaha}
                                    control= {salesTransactionControl}
                                    disable={false}
                                    handleChange={(data)=>{
                                        setSalesTransactionValue('usaha_id', data)
                                        handleProductOption(data)
                                    }}
                                />
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFAutocomplete
                                    label={'Produk'}
                                    name={'product_id'}
                                    options={productOption}
                                    control= {salesTransactionControl}
                                    disable={productOption.length == 0}
                                    handleChange={(data)=>{
                                        setSalesTransactionValue('product_id',data);
                                        productOption.map(({id,price})=>{
                                            if(id === data){
                                                setSalesTransactionValue('productPrice', price)
                                            }
                                        })
                                    }}
                                />
                            </FormControl>
                                {/* <Select defaultValue={1}>
                                    {
                                    options?.unitUsaha.map(({id, label})=>{
                                            return (
                                                <MenuItem value={id}>{label}</MenuItem>
                                            )
                                        })
                                    }
                                </Select> */}
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField type="number" label={'Jumlah Beli'} control={salesTransactionControl} name={'productCount'}></RHFTextField>
                                <Button sx={{witdh:'100%', marginTop:'1em'}} type="submit" variant="contained" color="success">Tambah Transaksi</Button>
                            </FormControl>
                        </form>
                    </DialogContent>
                </Dialog>
                <Dialog open={transaction.length === 0 ? false : true} onClose={()=>{handleCloseTransactionDetails()}} fullWidth maxWidth={'md'}>
                    <DialogTitle>
                        Detail transaksi
                    </DialogTitle>
                    <DialogContent>
                        <Button onClick={()=>handleAddSalesTransactionForm(transaction)} variant="contained" color="success">
                            Tambah Penjualan
                        </Button>
                        <TableContainer sx={{width:'100%'}}>
                            <Table>
                                <TableHead sx={{width:'100%'}}>
                                    <TableRow>
                                        <TableCell>
                                            No
                                        </TableCell>
                                        <TableCell>
                                            Nama Produk
                                        </TableCell>
                                        <TableCell>
                                            Harga Produk
                                        </TableCell>
                                        <TableCell>
                                            Jumlah Beli
                                        </TableCell>
                                        <TableCell>
                                            Total
                                        </TableCell>
                                        <TableCell>
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        transaction?.sales?.map((data)=>{
                                                return (
                                                    <>
                                                        <DetailPenjualanTableRow onDelete={()=>{handleDeleteDetailRow(data)}} onEdit={()=>{handleOpenEditForm(data)}} num={++detailNum} row={data} />
                                                    </>
                                                )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                </Dialog>
                <Dialog open={AddForm} onClose={()=>{handleCloseAddForm()}} fullWidth maxWidth={'xs'}>
                    <DialogTitle>
                        Edit transaksi
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl sx={{width:'100%'}}>
                                <input type="hidden" name="id"></input>
                                <RHFTextField type="number" control={control} label={'Jumlah Beli'} name={'productCount'} />
                                <Button variant="contained" color="success" type={'submit'} sx={{marginTop: '0.5em'}}>Simpan Perubahan</Button>
                            </FormControl>
                        </form>
                    </DialogContent>
                </Dialog>
                <Card sx={{marginY:'1em'}}>
                
                    <TableContainer>
                        <Table>
                            <CustomTableHead tableHead={TABLEHEAD}></CustomTableHead>
                            <TableBody>
                                {
                                    products === [] || products==='' || products.length == 0 || products === undefined ? (
                                        <TableRow>
                                            <TableCell>Data kosong</TableCell>
                                        </TableRow>
                                    ) :
                                    products?.map((map)=>{
                                        if(map.sales.length != 0){
                                            return ( <>
                                                <PenjualanTableRow 
                                                key={detailNum} 
                                                onDetail={()=>{handleTransactionDetails(map)}}
                                                onEdit={() => handleOpenEditForm(map)} 
                                                num={++detailNum} row={map}>
                                                </PenjualanTableRow>
                                            </>
                                            )
                                        }
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