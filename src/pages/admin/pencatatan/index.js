import axios from "../../../utils/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import { Button, Card, Dialog, DialogTitle, DialogContent, FormControl, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Input, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, MenuList, InputLabel } from "@mui/material";
import RHFTextField from "../../../components/form/RHFTextField";
import RHFAutocomplete from "../../../components/form/RHFAutocomplete";
import CustomTableHead from "../../../components/table/CustomTableHead";
import { getAllUnitUsaha, getAllUnitUsahaAdmin, getAllUnitUsahaProduct } from "../../../helper/dataOptions";
import KeuanganTableRow from "../../../sections/keuangan/KeuanganTableRow";
import SpendingTableRow from "../../../sections/keuangan/SpendingTableRow";
import {getCookie} from 'cookies-next';
import  ChevronRight  from "@mui/icons-material/ChevronRight";
import  ChevronLeft  from "@mui/icons-material/ChevronLeft";
import { formatCurrency } from "../../../helper/currency";
import { useEffect } from "react";
import { checkPrivilege } from "../../../helper/admin";
import RHFSelect from "../../../components/form/RHFSelect";
import { Label } from "@mui/icons-material";

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
        let transaksi = await axios.post('/api/admin/transaksi/pencatatan-detail',{
            "year": ''
        },{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        let year = await axios.get('/api/admin/transaksi/year',{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        let stat = await axios.post('/api/admin/transaksi/pencatatan',{        
            "year": ''
        },{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        let unitUsaha = await getAllUnitUsahaAdmin(token);

        return {
            props:{
                isSuper: admin.adminLevel == '1' ? true : false,
                admin: admin,
                transaksi: transaksi.data.data,
                stat:stat.data,
                year: year.data,
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

export default function keuangan({isSuper,admin,transaksi, stat, options,year}){
    console.log(options)
    let [loading, setLoading] = useState(false)
    const router = useRouter();
    let token = getCookie('token');
    let title = 'Stock';
    let [data, setData] = useState(transaksi.data);
    let [dataLink, setDataLink] = useState(transaksi.links);
    let [statData, setStat] = useState(stat);
    let [transaction, setTransaction] = useState([]);
    let [editMode, setEditMode] = useState(false);
    let [filterYear, setYear] = useState('');
    //Next router
    
      const schemaAddSpendingTransaction = yup.object().shape({
        unit_usaha_id: yup.string().required('Unit usaha tidak boleh kosong'),
        SpendingName: yup.string().required('Nama pengeluaran tidak boleh kosong'),
        create_time: yup.string().required('Tanggal tidak boleh kosong'),
        SpendingDescription: yup.string().required('Deskripsi pengeluaran tidak boleh kosong'),
        SpendingValue: yup.string().required('Jumlah pengeluaran tidak boleh kosong'),
    })

    const { control, handleSubmit, setValue ,formState:{errors}} = useForm({
        defaultValues: {
          transactionType:'PENGELUARAN',
          unit_usaha_id:'',
          SpendingName:'',
          create_time:'',
          SpendingDescription:'',
          SpendingValue:0
        },
        resolver: yupResolver(schemaAddSpendingTransaction)
      })
    
      const onSubmit = async (data) => {
        setLoading(true)
        if(editMode == true){
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                handleCloseAddForm();
                await axios.put('/api/admin/transaksi/spending/'+data.id,data,{
                    headers: { Authorization: `Bearer `+token},
                    withCredentials: true
                }).then((r)=>{
    
                }).catch((e)=>{
                    console.log(e);
                })
            }).catch((e)=>{
                console.log(e)
            })
            router.replace(router.asPath);
            setLoading(false)
        }else{
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                handleCloseAddForm();
                await axios.post('/api/admin/transaksi',data,{
                    headers: { Authorization: `Bearer `+token},
                    withCredentials: true
                }).then((r)=>{
    
                }).catch((e)=>{
                    console.log(e);
                })
            }).catch((e)=>{
                console.log(e)
            })
            router.replace(router.asPath);
            setLoading(false)
        }
      }
      
      let handleDelete = (data)=>{
        axios.get('/sanctum/csrf-cookie',{
            headers: { Authorization: `Bearer `+token},
            withCredentials: true
        }).then((r)=>{
            axios.delete('/api/transaksi/'+data.id,{
                headers: { Authorization: `Bearer `+token
                },
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
    }
      //states
    const [AddForm, setAddForm] = useState(false);

    //state handler
    let handleCloseAddForm = ()=>{
        setAddForm(false);
        setEditMode(false);
        setValue('unit_usaha_id','');
        setValue('SpendingName','');
        setValue('SpendingDescription','');
        setValue('SpendingValue',0);
    }
    
    let handleOpenUpdateForm = (data)=>{
        setAddForm(true);
        setEditMode(true);
        console.log(data);
        setValue('unit_usaha_id',data.spending.unit_usaha_id);
        setValue('id',data.spending.id);
        setValue('SpendingName',data.spending.SpendingName);
        setValue('SpendingDescription',data.spending.SpendingDescription);
        setValue('SpendingValue',data.spending.SpendingValue);
        setValue('create_time',data.spending.create_time);
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
            setData(unitUsaha?.data?.data?.data)
            setDataLink(unitUsaha?.data?.data?.links)
        }
    }

    let handleChangeFilter = async (year)=>{
        setYear(year);
        let stat = await axios.post('/api/admin/transaksi/pencatatan',{        
            "year": year
        },{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        let produk = await axios.post('/api/admin/transaksi/pencatatan-detail',{
            "year": year
        },{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        setData(produk.data.data.data)
        setDataLink(produk.data.data.links)
        setStat(stat.data)
    }

    let TABLEHEAD = [
        {value: 'No',align: 'left'},
        {value: 'Nama',align: 'left'},
        {value: 'Tanggal',align: 'left'},
        {value: 'Tipe Transaksi',align: 'left'},
        {value: 'Total',align: 'left'},
        {value: 'action',align: 'center'},
    ]
    
    let num = 0;
    let detailNum = 0;

    useEffect(() => {
        setData(transaksi.data)
        setDataLink(transaksi.links)
      }, [transaksi]);

    return (
        <>
            <AdminLayout isSuper={isSuper} admin={admin} handleLoading={loading}>
            <Typography variant="h3" color={'#94B60F'} fontWeight={400} sx={{textDecoration:'underline'}}>Pencatatan Transaksi</Typography>
            
            <Box sx={{justifyContent:'space-between', flexDirection:'row', display:'flex', marginY:'1em', gap:'1em'}}>
                <Card sx={{width:'100%',padding:'1em'}}>
                    <Typography variant="h6">
                        Pemasukan
                    </Typography>
                    Rp.{formatCurrency(Number(statData.penjualan?.total))}
                </Card>
                <Card sx={{width:'100%',padding:'1em'}}>
                    <Typography variant="h6">
                        Pengeluaran
                    </Typography>
                    Rp.{ formatCurrency(Number(statData.pengeluaran?.total))}
                </Card>
                <Card sx={{width:'100%',padding:'1em'}}>
                    <Typography variant="h6">
                        Total
                    </Typography>
                    Rp.{ formatCurrency( Number(statData.penjualan?.total) - Number(stat.pengeluaran?.total) )}
                </Card>
            </Box>
            <Box sx={{display:'flex', justifyContent:'space-between'}}>
                <Button color="success" sx={{marginY:'1em'}} variant="contained" onClick={()=>{openSpendingForm()}}>
                    Tambah Pengeluaran
                </Button>
                <FormControl sx={{width:'10em'}}>
                    <InputLabel id="labelPeriode">Periode</InputLabel>
                    <Select onChange={(e)=>{
                        handleChangeFilter(e.target.value);

                    }} value={filterYear} label="Periode" labelId="labelPeriode">
                    {
                            year.map((value)=>{
                                return (
                                    <MenuItem value={value.year}>{value.year}</MenuItem>
                                )
                            })
                        }
                            </Select>
                </FormControl>
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
                <Dialog onClose={handleCloseAddForm} open={AddForm} fullWidth maxWidth="xs">
                    <DialogTitle>
                        {editMode == true ? "Edit" : 'Tambah'} Pengeluaran
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl sx={{width:'100%'}}>
                                <Typography>Unit Usaha</Typography>
                                <RHFSelect sx={{width:'100%'}}
                                    name={'unit_usaha_id'}
                                    option={options.unitUsaha}
                                    control= {control}
                                />
                                <RHFTextField sx={{width:'100%'}} label={'Nama Pengeluaran'} control={control} name={'SpendingName'}></RHFTextField>
                                <Typography>Tanggal</Typography>
                                <RHFTextField hiddenLabel={true} type="date" sx={{width:'100%'}} label={''} control={control} name={'create_time'}></RHFTextField>
                                <RHFTextField sx={{width:'100%'}} label={'Deskripsi Pengeluaran'} control={control} name={'SpendingDescription'}></RHFTextField>
                                <RHFTextField sx={{width:'100%'}} label={'Jumlah Pengeluaran'} control={control} name={'SpendingValue'}></RHFTextField>
                                <Button sx={{marginTop:'1em'}} variant="contained" color="success" type="submit">Simpan Pengeluaran</Button>
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
                                    data === [] || data==='' || data === undefined || data.length === 0 ? (
                                        <TableRow>
                                            <TableCell>Data kosong</TableCell>
                                        </TableRow>
                                    ) :
                                    data?.map((map)=>{
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
                                        }else if(map.spending != undefined){
                                            return ( <>
                                                <SpendingTableRow 
                                                key={detailNum} 
                                                onDetail={()=>{handleTransactionDetails(map)}}
                                                onEdit={() => handleOpenUpdateForm(map)} 
                                                onDelete={()=> handleDelete(map)}
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
                    <Box sx={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                    {
                        dataLink.map((link)=>{
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