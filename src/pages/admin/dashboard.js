import { Autocomplete, Box, Button, Card, Container, Dialog, DialogContent, DialogTitle, FormControl, Grid, TextField, Typography } from "@mui/material";
import CustomBarChart from "../../components/chart/CustomBarChart";
import AdminLayout from "../../layouts/adminLayout/AdminLayout";
import CustomLineChart from "../../components/chart/CustomLineChart";
import CustomDoughnutChart from "../../components/chart/CustomDoughnutChart";
import {getCookie} from 'cookies-next';
import axios from "../../utils/axios";
import { useState } from "react";
import { getAllKecamatanById, getAllKelurahanById, getAllKotaById, getAllProvinsi, getAllUnitUsaha } from "../../helper/dataOptions";
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
                'rgba(75, 255, 75, 0.5)',
            ]
        },
            {
            label: 'Pengeluaran',
            data:[],
            backgroundColor:[
                'rgba(75, 100, 255, 0.5)',
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
                    'rgba(99, 255, 200, 0.5)',
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
                    'rgba(200, 99, 255, 0.5)',
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
        console.log(data)
        produkTerlaris.datasets[0].data.push(data.total);
        produkTerlaris.labels.push(data.product.productName);
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
    let [kota, setKota] = useState([])
    let [kecamatan, setkecamatan] = useState([])
    let [kelurahan, setKelurahan] = useState([])
    let handleChange = async ()=>{
        console.log(filterData);
        let dashboard = await axios.post('/api/dashboard/',filterData);
        setData(formatDashboardData(dashboard))
        setFilter({"from":"2018-01-01",
        "to":"2025-01-01",
        "kelurahan":'',
        "unitUsaha":'',
        "kecamatan":'',
        "kota":'',
        "provinsi":''})
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
                    <FormControl>
                        <label>
                            <Typography>
                                Unit usaha
                            </Typography>
                        </label>
                        <Autocomplete
                        options={options.unitUsaha}
                        renderInput={(params) => <TextField {...params} label={'Unit Usaha'} />}
                        onChange={(e, unitUsahaData) => {
                            let filter = filterData;
                            filter.unitUsaha = unitUsahaData.id
                            console.log(unitUsahaData)
                            setFilter(filter);
                            return unitUsahaData
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
                        active
                        renderInput={(params) => <TextField {...params} label={'Provinsi'} />}
                        onChange={async(e, unitUsahaData) => {
                            let filter = filterData;
                            filter.provinsi = unitUsahaData.id
                            console.log(unitUsahaData)
                            setFilter(filter);
                            setKota(await getAllKotaById(unitUsahaData.id))
                            return unitUsahaData
                        }}
                        />
                    </FormControl>
                    <FormControl>
                        <label>
                            <Typography>
                                Kota
                            </Typography>
                        </label>
                        <Autocomplete
                        options={kota}
                        disabled={kota.length == 0}
                        renderInput={(params) => <TextField {...params} label={'Kota'} />}
                        onChange={async(e, unitUsahaData) => {
                            let filter = filterData;
                            filter.kota = unitUsahaData.id
                            console.log(unitUsahaData)
                            setFilter(filter);
                            setkecamatan(await getAllKecamatanById(unitUsahaData.id))
                            return unitUsahaData
                        }}
                        />
                    </FormControl>
                    <FormControl>
                        <label>
                            <Typography>
                                Kecamatan
                            </Typography>
                        </label>
                        <Autocomplete
                        options={kecamatan}
                        disabled={kecamatan.length == 0}
                        renderInput={(params) => <TextField {...params} label={'Kecamatan'} />}
                        onChange={async(e, unitUsahaData) => {
                            let filter = filterData;
                            filter.kecamatan = unitUsahaData.id
                            console.log(unitUsahaData)
                            setFilter(filter);
                            setKelurahan(await getAllKelurahanById(unitUsahaData.id))
                            return unitUsahaData
                        }}
                        />
                    </FormControl>
                    <FormControl>
                        <label>
                            <Typography>
                                Kelurahan
                            </Typography>
                        </label>
                        <Autocomplete
                        options={kelurahan}
                        disabled={kelurahan.length == 0}
                        renderInput={(params) => <TextField {...params} label={'Kelurahan'} />}
                        onChange={(e, unitUsahaData) => {
                            let filter = filterData;
                            filter.kelurahan = unitUsahaData.id
                            console.log(unitUsahaData)
                            setFilter(filter);
                            return unitUsahaData
                        }}
                        />
                    </FormControl>
                    <Button color="success" sx={{marginTop:'1em'}} variant="contained" onClick={()=>{handleChange()}}>Terapkan Filter</Button>
                </DialogContent>
            </Dialog>
                
                <AdminLayout handleLoading={loading}>
                    <Container maxWidth={'lg'}>
                        <Grid container sx={{margin:'-1em'}}>
                            <Grid item xs={'12'}>
                                <Box sx={{margin:'1em', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                <Typography variant="h3" color={'#94B60F'} sx={{textDecoration:'underline'}} fontWeight={400}>
                                    Dashboard
                                </Typography>
                                <Button variant="contained" color="success" sx={{height:'0',marginY:'auto'}} onClick={()=>{setOpenFilter(true)}} startIcon={<FilterAlt></FilterAlt>}>
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
                                        <Typography sx={{fontWeight:'600'}}>
                                            Pengunjung
                                        </Typography>
                                        {dashboardData?.visitor[0]?.total}
                                    </Card>
                                    <Card sx={{width:'100%',padding:'1em'}}>
                                        <Typography sx={{fontWeight:'600'}}>
                                            Pelanggan
                                        </Typography>
                                        {dashboardData?.pelangganStat}
                                    </Card>
                                    <Card sx={{width:'100%',padding:'1em'}}>
                                        <Typography sx={{fontWeight:'600'}}>
                                            Jumlah Produk Terjual
                                        </Typography>
                                        {dashboardData?.totalProdukTerjual}
                                    </Card>
                                    <Card sx={{width:'100%',padding:'1em'}}>
                                    <Typography sx={{fontWeight:'600'}}>
                                        Stok
                                    </Typography>
                                        {dashboardData?.totalStok[0]?.total}
                                    </Card>
                                </Box>
                            </Grid>

                            <Grid item xs={'6'} paddingY={'1em'} paddingLeft={'1em'} paddingRight={'0.5em'}>
                                <Card sx={{height:'50vh',padding:'1em'}}>
                                    <CustomLineChart chartTitle={'Penjualan'} dataset={dashboardData?.total}></CustomLineChart>
                                </Card>
                            </Grid>  
                            
                            <Grid item xs={'6'} paddingY={'1em'} paddingLeft={'0.5em'} paddingRight={'1em'}>
                                <Card sx={{height:'50vh',padding:'1em'}}>
                                    <CustomBarChart chartTitle={'Unit usaha dengan produk terlaris'} dataset={dashboardData?.produkTerlaris} color={['#049ffb','#58B63B']}></CustomBarChart>
                                </Card>
                            </Grid>  
    
                        </Grid>
                    </Container>
                </AdminLayout>
        </>
    )
}