import { Autocomplete, Box, Button, Card, Container, Dialog, DialogContent, DialogTitle, FormControl, Grid, TextField, Typography } from "@mui/material";
import CustomBarChart from "../../components/chart/CustomBarChart";
import AdminLayout from "../../layouts/adminLayout/AdminLayout";
import CustomLineChart from "../../components/chart/CustomLineChart";
import CustomDoughnutChart from "../../components/chart/CustomDoughnutChart";
import {getCookie} from 'cookies-next';
import axios from "../../utils/axios";
import { useState } from "react";
import { getAllProvinsi, getAllUnitUsaha } from "../../helper/dataOptions";
import  FilterAlt  from "@mui/icons-material/FilterAlt";
import {RHFAutocomplete} from "../../components/form/RHFAutocomplete";

function formatDashboardData(dashboard){
    let penjualan = {
        labels:[],
        datasets:[
            {
            label: 'Penjualan',
            data:[],
            backgroundColor:[
                'rgba(255, 99, 132, 0.2)',
            ]
        },
            {
            label: 'Pengeluaran',
            data:[],
            backgroundColor:[
                'rgba(75, 192, 192, 0.2)',
            ]
        }
        ]
    };
    let total = {
        labels:[],
        datasets:[
            {
                label: 'Penjualan',
                data:[],
                backgroundColor:[
                    'rgba(255, 99, 132, 0.2)',
                ]
            }
        ]
    }

    let produkTerlaris = {
        labels:[],
        datasets:[
            {
                label: 'Terlaris',
                data:[],
                backgroundColor:[
                    'rgba(255, 99, 132, 0.2)',
                ]
            }
        ]
    }

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'];
    let totalProdukTerjual = 0;
    dashboard.data.penjualan.map((data)=>{
        penjualan.labels.push(labels[data.month-1])
        penjualan.datasets[0].data.push(data.total)
        total.labels.push(labels[data.month-1])
        total.datasets[0].data.push(data.total)
        totalProdukTerjual += data.countPenjualan;
    })
    dashboard.data.pengeluaran.map((data)=>{
        penjualan.datasets[1].data.push(data.total)
    })
    dashboard.data.produkTerlaris.map((data,index)=>{
        produkTerlaris.datasets[index].data.push(data.total);
        produkTerlaris.labels.push(data.product.unit_usaha.usahaName);
    })
    return {
        penjualan: penjualan,
        total: total,
        produkTerlaris: produkTerlaris,
        visitor: dashboard.data.visitor,
        pengeluaran: dashboard.data.pelangganStat,
        totalStok: dashboard.data.totalStok,
        totalProdukTerjual: totalProdukTerjual,
        pelangganStat: dashboard.data.pelangganStat
    }
}

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
    let dashboard = await axios.post('/api/dashboard/',{        
        "from":"2018-01-01",
        "to":"2025-01-01",
        "kelurahan":'',
        "unitUsaha":'',
        "kecamatan":'',
        "kota":'',
        "provinsi":''
    }).catch(e=>{
        console.log(e)
    });
    console.log(dashboard);
    let unitUsaha = await getAllUnitUsaha()
    let provinsi = await getAllProvinsi();
    return {
        props:{
            data:formatDashboardData(dashboard),
            options: {
                unitUsaha: unitUsaha,
                provinsi: provinsi
            }
        }
    }
}

export default function Dashboard({data, options}){
    let [loading, setLoading] = useState(false)
    let [dashboardData, setData] = useState(data)
    let [filterData, setFilter] = useState({
        from: '',
        to:'',
        location:'',
        locationId:'',
        unitUsaha:''
    });
    let handleChange = async ()=>{
        console.log(filterData);
        let dashboard = await axios.post('/api/dashboard/',filterData);
        setData(formatDashboardData(dashboard))
    }
    const [openFilter, setOpenFilter] = useState(false);
    return (
        <>
            <Dialog  open={openFilter} maxWidth="sm" fullWidth onClose={()=>{setOpenFilter(false)}}>
                <DialogTitle>
                    Filter
                </DialogTitle>
                <DialogContent  sx={{display:'flex',flexDirection:'column',gap:'1em'}}>
                    <FormControl sx={{display:'flex',flexDirection:'row',gap:'1em'}}>
                        <FormControl sx={{width:'100%'}}>
                            <label>
                                <Typography>
                                    Dari
                                </Typography>
                            </label>
                            <TextField type="date" onChange={(e)=>{
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
                            <TextField type="date" onChange={(e)=>{
                                let filter = filterData;
                                filter.to = e.target.value
                                setFilter(filter);
                            }}></TextField>
                        </FormControl>
                    </FormControl>
                    <FormControl>
                        <label>
                            <Typography>
                                Unit usaha
                            </Typography>
                        </label>
                        <Autocomplete
                        options={options.unitUsaha}
                        renderInput={(params) => <TextField {...params} label={'Unit Usaha'} />}
                        onChange={(e, data) => {
                            let filter = filterData;
                            filter.unitUsaha = e.target.value
                            return data
                        }}
                        />
                    </FormControl>
                    <FormControl>
                        <label>
                            <Typography>
                                Provinsi
                            </Typography>
                        </label>
                        <Autocomplete
                        options={options.provinsi}
                        renderInput={(params) => <TextField {...params} label={'Unit Usaha'} />}
                        onChange={(e, data) => {
                            let filter = filterData;
                            filter.unitUsaha = e.target.value
                            return data
                        }}
                        />
                    <Button onClick={()=>{handleChange()}}>Terapkan Filter</Button>
                    </FormControl>
                </DialogContent>
            </Dialog>
                
                <AdminLayout handleLoading={loading}>
                    <Container maxWidth={'lg'}>

                        
                        
                        <Grid container sx={{margin:'-1em'}}>
    
                            <Grid item xs={'12'}>
                                <Box sx={{margin:'1em', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                <Typography variant={'h3'}>
                                    Dashboard
                                </Typography>
                                <Button variant="contained" sx={{height:'0',marginY:'auto'}} onClick={()=>{setOpenFilter(true)}} startIcon={<FilterAlt></FilterAlt>}>
                                    Filter
                                </Button>
                                </Box>
                            </Grid>  

                            <Grid item xs={'12'}>
                                <Card sx={{height:'50vh',padding:'1em', margin:'1em'}}>
                                    <CustomBarChart chartTitle={'Keuangan'} dataset={dashboardData?.penjualan} color={['#049ffb','#58B63B']}></CustomBarChart>
                                </Card>
                            </Grid>  
    
                            <Grid item xs={'12'} sx={{marginX:'1em'}}>
                                <Box sx={{justifyContent:'space-between', flexDirection:'row', display:'flex', gap:'1em'}}>
                                    <Card sx={{width:'100%',padding:'1em'}}>
                                        <Typography>
                                            Pengunjung
                                        </Typography>
                                        {dashboardData?.visitor[0]?.total}
                                    </Card>
                                    <Card sx={{width:'100%',padding:'1em'}}>
                                        <Typography>
                                            Pelanggan
                                        </Typography>
                                        {dashboardData?.pelangganStat}
                                    </Card>
                                    <Card sx={{width:'100%',padding:'1em'}}>
                                        <Typography>
                                            Jumlah Produk Terjual
                                        </Typography>
                                        {dashboardData?.totalProdukTerjual}
                                    </Card>
                                    <Card sx={{width:'100%',padding:'1em'}}>
                                    <Typography>
                                        Stok
                                    </Typography>
                                        {dashboardData?.totalStok[0]?.total}
                                    </Card>
                                </Box>
                            </Grid>
    
                            <Grid item xs={'6'}>
                                <Card sx={{height:'50vh',padding:'1em', margin:'1em'}}>
                                    <CustomLineChart chartTitle={'Penjualan'} dataset={dashboardData?.total}></CustomLineChart>
                                </Card>
                            </Grid>  
                            
                            <Grid item xs={'6'}>
                                <Card sx={{height:'50vh',padding:'1em', margin:'1em'}}>
                                    <CustomBarChart chartTitle={'Unit usaha dengan produk terlaris'} dataset={dashboardData?.produkTerlaris} color={['#049ffb','#58B63B']}></CustomBarChart>
                                </Card>
                            </Grid>  
    
                        </Grid>
                    </Container>
                </AdminLayout>
            
        </>
    )
}