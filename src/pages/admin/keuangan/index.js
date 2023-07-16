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
import KeuanganTableRow from "../../../sections/keuangan/KeuanganTableRow";
import SpendingTableRow from "../../../sections/keuangan/SpendingTableRow";
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
        let produk = await axios.get('/api/admin/transaksi',{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        let unitUsaha = await getAllUnitUsaha();
        return {
            props:{
                produk: produk.data.data,
                options:{
                    unitUsaha: unitUsaha
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

export default function keuangan({produk, options}){

    const router = useRouter();

    let title = 'Stock';
    let [products, setProducts] = useState(produk.data);
    let [transaction, setTransaction] = useState([]);
    let [formTitle, setFormTitle] = useState([]);
    let [addDetailTransactionForm, setAddDetailTransactionForm] = useState('');
    let [productOption, setProductOptions] = useState([]);
    //Next router
    
      const schemaAddSpendingTransaction = yup.object().shape({
        unit_usaha_id: yup.string().required('Unit usaha tidak boleh kosong'),
        SpendingName: yup.string().required('Nama pengeluaran tidak boleh kosong'),
        SpendingDescription: yup.string().required('Deskripsi pengeluaran tidak boleh kosong'),
        SpendingValue: yup.string().required('Jumlah pengeluaran tidak boleh kosong'),
    })

    const { control, handleSubmit, setValue ,formState:{errors}} = useForm({
        defaultValues: {
          transactionType:'PENGELUARAN',
          unit_usaha_id:'',
          SpendingName:'',
          SpendingDescription:'',
          SpendingValue:0
        },
        resolver: yupResolver(schemaAddSpendingTransaction)
      })
    
      const onSubmit = async (data) => {
        let token = getCookie('token');
        await axios.get('/sanctum/csrf-cookie',{
            headers: { Authorization: `Bearer `+token},
            withCredentials: true
        }).then(async (r)=>{
            await axios.post('/api/admin/transaksi/',data,{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then((r)=>{
                console.log(r.data)
            }).catch((e)=>{
                console.log(e);
            })
        }).catch((e)=>{
            console.log(e)
        })
        handleCloseAddForm();
        router.reload();
      }
      
      //states
    const [AddForm, setAddForm] = useState(false);

    //state handler
    let handleCloseAddForm = ()=>{
        setAddForm(false);
        setValue('unit_usaha_id','');
        setValue('SpendingName','');
        setValue('SpendingDescription','');
        setValue('SpendingValue',0);
    }
    
    let openSpendingForm = (data)=>{
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

    let TABLEHEAD = [
        {value: 'No',align: 'left'},
        {value: 'Nama Client',align: 'left'},
        {value: 'Tipe Transaksi',align: 'left'},
        {value: 'Total',align: 'left'}
    ]
    
    let num = 0;
    let detailNum = 0;

    return (
        <>
            <AdminLayout>
            <Typography variant="h3" fontWeight={400}>Keuangan</Typography>
            <Button color="success" variant="contained" onClick={()=>{openSpendingForm()}}>
                Tambah Pengeluaran
            </Button>
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
                <Dialog onClose={handleCloseAddForm} open={AddForm}>
                    <DialogTitle>
                        Tambah Transaksi
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl>
                                <RHFAutocomplete
                                    name={'unit_usaha_id'}
                                    options={options.unitUsaha}
                                    control= {control}
                                    disable={false}
                                    handleChange={(data)=>{
                                        setValue('unit_usaha_id', data)
                                        return data
                                    }}
                                />
                                <RHFTextField label={'Nama Pengeluaran'} control={control} name={'SpendingName'}></RHFTextField>
                                <RHFTextField label={'Deskripsi Pengeluaran'} control={control} name={'SpendingDescription'}></RHFTextField>
                                <RHFTextField label={'Jumlah Pengeluaran'} control={control} name={'SpendingValue'}></RHFTextField>
                                {/* <Select defaultValue={1}>
                                    {
                                    options?.unitUsaha.map(({id, label})=>{
                                            return (
                                                <MenuItem value={id}>{label}</MenuItem>
                                            )
                                        })
                                    }
                                </Select> */}
                                <Button type="submit">Tambah Pengeluaran</Button>
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
                                                <KeuanganTableRow 
                                                key={detailNum} 
                                                onDetail={()=>{handleTransactionDetails(map)}}
                                                onEdit={() => handleOpenEditForm(map)} 
                                                num={++detailNum} row={map}>
                                                </KeuanganTableRow>
                                            </>
                                            )
                                        }else{
                                            return ( <>
                                                <SpendingTableRow 
                                                key={detailNum} 
                                                onDetail={()=>{handleTransactionDetails(map)}}
                                                onEdit={() => handleOpenEditForm(map)} 
                                                num={++detailNum} row={map}>
                                                </SpendingTableRow>
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