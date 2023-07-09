import axios from "../../../utils/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import { Button, Card, Dialog, DialogTitle, DialogContent, FormControl, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Input, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import RHFTextField from "../../../components/form/RHFTextField";
import RHFAutocomplete from "../../../components/form/RHFAutocomplete";
import CustomTableHead from "../../../components/table/CustomTableHead";
import { getAllUnitUsaha, getAllUnitUsahaProduct } from "../../../helper/dataOptions";
import PenjualanTableRow from "../../../sections/penjualan/PenjualanTableRow";
import DetailPenjualanTableRow from "../../../sections/penjualan/DetailPenjualanTableRow";

export async function getServerSideProps(){
    let produk = await axios.get('http://127.0.0.1:8000/api/transaksi');
    let unitusaha = await getAllUnitUsaha();
    return {
        props:{
            produk: produk.data.data,
            options:{
                unitUsaha: unitusaha
            }
        }
    }
}

export default function product({produk, options}){
    let title = 'Stock';
    let [products, setProducts] = useState(produk.data);
    let [transaction, setTransaction] = useState([]);
    let [formTitle, setFormTitle] = useState([]);
    let [addDetailTransactionForm, setAddDetailTransactionForm] = useState('');
    let [productOption, setProductOptions] = useState([]);
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
        resolver: yupResolver(schemaAddSalesTransaction)
      })
    
      const onSubmit = async (data) => {
        if(editMode == true){
            const createproduk = await axios.put('/api/penjualan/'+data.id,data);
            
        }
        handleCloseAddForm();
        router.replace(router.asPath);
      }

      const onSalesTransactionSubmit = async (data) => {
        data.transactionAddress = addDetailTransactionForm.sales[0].transactionAddress
        data.client_id = addDetailTransactionForm.sales[0].client_id
        data.kelurahan_id = addDetailTransactionForm.sales[0].kelurahan_id
        data.transactionAmount = Number(data.productPrice) * data.productCount;
        try{
            let createSalesTransaction = await axios.post('/api/penjualan',data);
        }catch(e){
            console.log(e)
        }

      }
      
      //states
    const [AddForm, setAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);

    //state handler
    let handleChangeFilter = async (data)=>{
        if(data != '*'){
            let unitUsaha = await axios.get('/api/produk/withFilter/'+data);
            setProducts(unitUsaha?.data)
        }else{
            let unitUsaha = await axios.get('/api/produk/');
            setProducts(unitUsaha?.data?.data)
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
        handleCloseTransactionDetails()
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
            const deleteTransaction =await  axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL+'/api/penjualan/'+data.id);
        }catch(e){
            
        }finally{
            router.replace(router.asPath);
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
        setProductOptions(products);
    }

    let TABLEHEAD = [
        {value: 'No',align: 'left'},
        {value: 'Nama Client',align: 'left'},
        {value: 'Alamat',align: 'left'},
        {value: 'Status',align: 'left'},
        {value: 'Total', align:'left'},
        {value: 'Action',align: 'left'}
    ]
    
    let num = 0;
    let detailNum = 0;

    return (
        <>
            <AdminLayout>
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
                <Dialog onClose={handleCloseAddSalesTransactionForm} open={addDetailTransactionForm.length === 0 ? false : true}>
                    <DialogTitle>
                        Tambah Transaksi
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleSalesTransactionSubmit(onSalesTransactionSubmit)}>
                            <FormControl>
                                <RHFAutocomplete
                                    name={'usaha_id'}
                                    options={options.unitUsaha}
                                    control= {salesTransactionControl}
                                    disable={false}
                                    handleChange={(data)=>{
                                        setSalesTransactionValue('usaha_id', data)
                                        handleProductOption(data)
                                    }}
                                />
                                <RHFAutocomplete
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
                                {/* <Select defaultValue={1}>
                                    {
                                    options?.unitUsaha.map(({id, label})=>{
                                            return (
                                                <MenuItem value={id}>{label}</MenuItem>
                                            )
                                        })
                                    }
                                </Select> */}
                                <RHFTextField control={salesTransactionControl} name={'productCount'}></RHFTextField>
                                <Button type="submit">Tambah Transaksi</Button>
                            </FormControl>
                        </form>
                    </DialogContent>
                </Dialog>
                <Dialog open={transaction.length === 0 ? false : true} onClose={()=>{handleCloseTransactionDetails()}} fullWidth maxWidth={'md'}>
                    <DialogTitle>
                        Detail transaksi
                    </DialogTitle>
                    <DialogContent>
                        <TableContainer>
                            <TableHead>
                                <Button onClick={()=>handleAddSalesTransactionForm(transaction)}>
                                    Tambah Penjualan
                                </Button>
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
                                <RHFTextField control={control} label={'Jumlah Beli'} name={'productCount'} />
                                <Button type={'submit'}>Simpan Perubahan</Button>
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
                                    products === [] || products==='' || products === undefined ? (
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
                </Card>
            </AdminLayout>
        </>
    )
}