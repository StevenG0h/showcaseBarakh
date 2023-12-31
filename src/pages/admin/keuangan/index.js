import axios from "../../../utils/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import { Button, Card, Dialog, DialogTitle, DialogContent, FormControl, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Input, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, TextField } from "@mui/material";
import RHFTextField from "../../../components/form/RHFTextField";
import RHFAutocomplete from "../../../components/form/RHFAutocomplete";
import CustomTableHead from "../../../components/table/CustomTableHead";
import { getAllUnitUsaha, getAllUnitUsahaProduct } from "../../../helper/dataOptions";
import KeuanganTableRow from "../../../sections/keuangan/KeuanganTableRow";
import SpendingTableRow from "../../../sections/keuangan/SpendingTableRow";
import {getCookie} from 'cookies-next';
import  ChevronRight  from "@mui/icons-material/ChevronRight";
import  ChevronLeft  from "@mui/icons-material/ChevronLeft";
import { formatCurrency } from "../../../helper/currency";
import { useEffect } from "react";
import TotalTableRow from "../../../sections/keuangan/totalTableRow";
import { checkPrivilege } from "../../../helper/admin";

export async function getServerSideProps({req,res}){
    let token = getCookie('token',{req,res});
    if(token == undefined){
        return {
            redirect: {
              permanent: false,
              destination: "/auth",
            },
            props:{
          }}
    }
    let admin = '';
await checkPrivilege(token).then((r)=>{
        admin = r;
    }).catch((e)=>{
        return {
            redirect: {
                permanent: false,
                destination: "/auth",
            },
            props:{},
        };
    });
    try{
        let produk = await axios.post('/api/admin/transaksi/keuangan',{
            "from":"2018-01-01",
            "to":"2025-01-01",
            "kelurahan":'',
            "unitUsaha":'',
            "kecamatan":'',
            "kota":'',
            "provinsi":''
        },{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        let penjualan = produk?.data?.penjualan;
        let pengeluaran = produk?.data?.pengeluaran;
        let transaksi = '';
        transaksi=(penjualan?.map(
            data => {
                let checkPengeluaran =  pengeluaran.filter(pengeluaran => {
                    if(data.penjualan == null){
                        return true;
                    }else{
                         if (pengeluaran.year === data.year){
                            if (pengeluaran.month === data.month){
                                return true
                            }
                        }
                        return false;
                    }
                });
                return Object.assign({}, data, {
                    pengeluaran:checkPengeluaran[0] == undefined ? 0 : checkPengeluaran[0].pengeluaran,
                    month: checkPengeluaran[0] == undefined ? data.month : checkPengeluaran[0].month ,
                    year: checkPengeluaran[0] == undefined ? data.year : checkPengeluaran[0].year
                })
            }
        ))

        pengeluaran?.map(pengeluaranData=>{
            let filtered = transaksi.filter(transaksiData=>{
                if( transaksiData.month == pengeluaranData.month){
                    return true;
                }
                return false;
            })
            if(filtered.length == 0){
                pengeluaranData.penjualan = 0;
                transaksi.push(pengeluaranData)
            }
        })
        transaksi = transaksi.sort(function(a,b){
            return parseInt(a.year.toString()+a.month.toString()) - parseInt(b.year.toString()+b.month.toString())
        })
        let unitUsaha = await getAllUnitUsaha();
        return {
            props:{
                isSuper: admin.adminLevel == '1' ? true : false,
                admin: admin,
                produk: transaksi,
                // stat:stat.data,
                options:{
                    unitUsaha: unitUsaha
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

export default function keuangan({isSuper,admin,produk, options}){
    let [loading, setLoading] = useState(false)
    const router = useRouter();
    let token = getCookie('token');
    let title = 'Stock';
    let [products, setProducts] = useState(produk);
    //Next router
    
      const schemaAddSpendingTransaction = yup.object().shape({
        unit_usaha_id: yup.string().required('Unit usaha tidak boleh kosong'),
        SpendingName: yup.string().required('Nama pengeluaran tidak boleh kosong'),
        SpendingDescription: yup.string().required('Deskripsi pengeluaran tidak boleh kosong'),
        SpendingValue: yup.string().required('Jumlah pengeluaran tidak boleh kosong'),
    })

    let [filterData, setFilter] = useState({
        from: '',
        to:''
    });
    let [openFilter, setOpenFilter] = useState(false);
      
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
        {value: 'Pemasukan',align: 'left'},
        {value: 'Pengeluaran',align: 'left'},
        {value: 'Bulan',align: 'left'},
        {value: 'Total',align: 'left'},
    ]

    let handleChange = async ()=>{
        setLoading(true);
        let dashboard = await axios.post('/api/admin/transaksi/keuangan',filterData,{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        let penjualan = dashboard?.data?.penjualan;
        let pengeluaran = dashboard?.data?.pengeluaran;
        let transaksi = '';
        transaksi=(penjualan?.map(
            data => {
                let checkPengeluaran =  pengeluaran.filter(pengeluaran => {
                    if(data.penjualan == null){
                        return true;
                    }else{
                         if (pengeluaran.year === data.year){
                            if (pengeluaran.month === data.month){
                                return true
                            }
                        }
                        return false;
                    }
                });
                return Object.assign({}, data, {
                    pengeluaran:checkPengeluaran[0] == undefined ? 0 : checkPengeluaran[0].pengeluaran,
                    month: checkPengeluaran[0] == undefined ? data.month : checkPengeluaran[0].month ,
                    year: checkPengeluaran[0] == undefined ? data.year : checkPengeluaran[0].year
                })
            }
        ))

        pengeluaran?.map(pengeluaranData=>{
            transaksi.map(transaksiData=>{
                console.log(pengeluaranData)
                let included = transaksiData.month == pengeluaranData.month || transaksiData.year == pengeluaranData.year;
                if( transaksiData.month != pengeluaranData.month){
                    if(transaksiData.year != pengeluaranData.year){
                        pengeluaranData.penjualan = 0;
                        transaksi.push(pengeluaranData);
                    }
                }

            })
            console.log(' ')
        })
        console.log(transaksi)
        transaksi = transaksi.sort()
        setProducts(transaksi)
        setLoading(false);
        setOpenFilter(false);
    }
    
    let num = 0;
    let detailNum = 0;

    let totalPengeluaran = 0 ;
    products.map((data)=> {
        totalPengeluaran += data.pengeluaran
    });
    let totalPenjualan = 0;
    products.map((data)=> {
        totalPenjualan += Number(data.penjualan)
    });

    return (
        <>
        
            <AdminLayout isSuper={isSuper} admin={admin} handleLoading={loading}>
            <Dialog  open={openFilter} maxWidth="xs" fullWidth onClose={()=>{setOpenFilter(false)}}>
                <DialogTitle fontWeight={600}>
                    Filter
                </DialogTitle>
                <DialogContent  sx={{display:'flex',flexDirection:'column',gap:'1em'}}>
                    <FormControl sx={{display:'flex',flexDirection:'Column',gap:'1em'}}>
                        <FormControl sx={{width:'100%'}}>
                            <label>
                                <Typography>
                                    Dari
                                </Typography>
                            </label>
                            <TextField type="date" defaultValue={filterData.from} onChange={(e)=>{
                                let filter = filterData;
                                filter.from = e.target.value
                                setFilter(filter);
                            }}></TextField>
                        </FormControl>
                        <FormControl sx={{width:'100%'}}>
                            <label>
                                <Typography>
                                    Hingga
                                </Typography>
                            </label>
                            <TextField type="date" defaultValue={filterData.to} onChange={(e)=>{
                                let filter = filterData;
                                filter.to = e.target.value
                                setFilter(filter);
                            }}></TextField>
                        </FormControl>
                    </FormControl>
                    <Button color="success" sx={{marginTop:'1em'}} variant="contained" onClick={()=>{handleChange()}}>Terapkan Filter</Button>
                </DialogContent>
            </Dialog>
            <Typography variant="h3" color={'#94B60F'} fontWeight={400} sx={{textDecoration:'underline'}}>Laporan Keuangan</Typography>
            
            <Button sx={{marginTop:'1em'}} onClick={()=>{
                setOpenFilter(true)
            }} variant="contained" color="success">
                Filter
            </Button>

            <Box sx={{justifyContent:'space-between', flexDirection:'row', display:'flex', marginY:'1em', gap:'1em'}}>
                <Card sx={{width:'100%',padding:'1em'}}>
                    <Typography variant="h6">
                        Pemasukan
                    </Typography>
                    Rp.{formatCurrency(Number(totalPenjualan))}
                </Card>
                <Card sx={{width:'100%',padding:'1em'}}>
                    <Typography variant="h6">
                        Pengeluaran
                    </Typography>
                    Rp.{ formatCurrency(Number(totalPengeluaran))}
                </Card>
                <Card sx={{width:'100%',padding:'1em'}}>
                    <Typography variant="h6">
                        Total
                    </Typography>
                    Rp.{ formatCurrency(Number(totalPenjualan) - Number(totalPengeluaran) )}
                </Card>
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
                <Card sx={{marginY:'1em'}}>
                    <TableContainer>
                        <Table>
                            <CustomTableHead tableHead={TABLEHEAD}></CustomTableHead>
                            <TableBody>
                                {
                                    products.length === 0 ? (
                                        <TableRow>
                                            <TableCell>Data kosong</TableCell>
                                        </TableRow>
                                    ) :
                                    products?.map((map)=>{
                                            return ( <>
                                                <TotalTableRow 
                                                key={detailNum} 
                                                onDetail={()=>{handleTransactionDetails(map)}}
                                                onEdit={() => handleOpenEditForm(map)} 
                                                num={++detailNum} row={map}>
                                                </TotalTableRow>
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