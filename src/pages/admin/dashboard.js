import { Autocomplete, Box, Button, Card, Container, Dialog, DialogContent, DialogTitle, FormControl, Grid, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import CustomBarChart from "../../components/chart/CustomBarChart";
import AdminLayout from "../../layouts/adminLayout/AdminLayout";
import CustomLineChart from "../../components/chart/CustomLineChart";
import CustomDoughnutChart from "../../components/chart/CustomDoughnutChart";
import {getCookie} from 'cookies-next';
import axios from "../../utils/axios";
import { useState } from "react";
import { getAllKecamatanById, getAllKelurahanById, getAllKotaById, getAllProvinsi, getAllUnitUsaha, getAllUnitUsahaAdmin } from "../../helper/dataOptions";
import  FilterAlt  from "@mui/icons-material/FilterAlt";
import {RHFAutocomplete} from "../../components/form/RHFAutocomplete";
import CustomTableHead from "../../components/table/CustomTableHead";
import { checkPrivilege } from "../../helper/admin";
import  ArrowDownward  from "@mui/icons-material/ArrowDownward";
import fileDownload from "js-file-download";

function formatDashboardData(dashboard){
    let penjualan = {
        labels:[],
        datasets:[
            {
            label: 'Penjualan',
            data:[],
            backgroundColor:[
                'rgba(147,182,40, 1)',
            ]
        },
            {
            label: 'Pengeluaran',
            data:[],
            backgroundColor:[
                'rgba(9, 27, 28, 1)',
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
                    'rgba(9, 27, 28, 1)',
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
                    'rgba(147,182,40, 1)',
                ]
            }
        ]
    }

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'];
    let totalProdukTerjual = 0;
    let dataPenjualan = dashboard.data.penjualan;
    let dataPengeluaran = dashboard.data.pengeluaran;
    let transaksi=(dataPenjualan?.map(
        data => {
            let checkPengeluaran =  dataPengeluaran.filter(pengeluaran => {

                     if (pengeluaran.year === data.year){
                        if (pengeluaran.month === data.month){
                            return true
                        }
                    }
                    return false;
                
            });
            return Object.assign({}, data, {
                pengeluaran:checkPengeluaran[0] == undefined ? 0 : checkPengeluaran[0].pengeluaran,
                month: checkPengeluaran[0] == undefined ? data.month : checkPengeluaran[0].month ,
                year: checkPengeluaran[0] == undefined ? data.year : checkPengeluaran[0].year
            })
        }
    ))
    dataPengeluaran?.map(pengeluaranData=>{
        let filtered = transaksi.filter(transaksiData=>{
            if( transaksiData.month == pengeluaranData.month){
                return true;
            }
            return false;
        })
        if(filtered.length == 0){
            pengeluaranData.total = 0;
            pengeluaranData.countPenjualan = 0;
            pengeluaranData.pengeluaran = pengeluaranData?.pengeluaran;
            transaksi.push(pengeluaranData)
        }
    })
    transaksi = transaksi.sort(function(a,b){
        return parseInt(a.year.toString()+a.month.toString()) - parseInt(b.year.toString()+b.month.toString())
    })
    transaksi?.map(data=>{
        penjualan.labels.push(labels[data.month-1])
        penjualan.datasets[0].data.push(data.total)
        penjualan.datasets[1].data.push(data.pengeluaran)
        total.datasets[0].data.push(data.countPenjualan)
        total.labels.push(labels[data.month-1])
        totalProdukTerjual += parseInt(data.countPenjualan);
    })
    dashboard.data.produkTerlaris.map((data,index)=>{
        produkTerlaris.datasets[0].data.push(data.total);
        produkTerlaris.labels.push(data.product.productName);
    })
    let latest = -1;
    let pelangganDetail = [];
    let scope = dashboard.data.pelangganDetail.scope;
    dashboard.data.pelangganDetail.detail.map((data,index)=>{
        if(scope == 'global'){
            if(pelangganDetail[latest]?.provinsiId == data.IDProvinsi){
                pelangganDetail[latest].total = pelangganDetail[latest].total + Number(data.Total);
                pelangganDetail[latest].totalTransaksi = pelangganDetail[latest].totalTransaksi + Number(data.TotalTransaksi)
                pelangganDetail[latest].unitUsaha.push({
                    label: data.UnitUsaha,
                    id: data.UnitUsahaId
                })
            }else{
                pelangganDetail.push({
                    scope: 'root',
                    totalTransaksi: Number(data.TotalTransaksi),
                    total: Number(data.Total),
                    provinsi:data.Provinsi,
                    provinsiId: data.IDProvinsi,
                    unitUsaha:[
                        {
                            label: data.UnitUsaha,
                            id: data.UnitUsahaId
                        }
                    ]
                })
                latest = latest+1;
            }
        }else if(scope == 'provinsi'){
            if(pelangganDetail[latest]?.kotaId == data.IDKota){
                pelangganDetail[latest].total = pelangganDetail[latest].total + Number(data.Total);
                pelangganDetail[latest].totalTransaksi = pelangganDetail[latest].totalTransaksi + Number(data.TotalTransaksi)
                pelangganDetail[latest].unitUsaha.push({
                    label: data.UnitUsaha,
                    id: data.UnitUsahaId
                })
            }else{
                pelangganDetail.push({
                    scope: 'root',
                    totalTransaksi: Number(data.TotalTransaksi),
                    total: Number(data.Total),
                    kota:data.Kota,
                    kotaId: data.IDKota,
                    unitUsaha:[
                        {
                            label: data.UnitUsaha,
                            id: data.UnitUsahaId
                        }
                    ]
                })
                latest = latest+1;
            }
        }else if(scope == 'kota'){
            if(pelangganDetail[latest]?.kecamatanId == data.IDKecamatan){
                pelangganDetail[latest].total = pelangganDetail[latest].total + Number(data.Total);
                pelangganDetail[latest].totalTransaksi = pelangganDetail[latest].totalTransaksi + Number(data.TotalTransaksi)
                pelangganDetail[latest].unitUsaha.push({
                    label: data.UnitUsaha,
                    id: data.UnitUsahaId
                })
            }else{
                pelangganDetail.push({
                    scope: 'root',
                    totalTransaksi: Number(data.TotalTransaksi),
                    total: Number(data.Total),
                    kecamatan:data.Kecamatan,
                    kecamatanId: data.IDKecamatan,
                    unitUsaha:[
                        {
                            label: data.UnitUsaha,
                            id: data.UnitUsahaId
                        }
                    ]
                })
                latest = latest+1;
            }
        }else if(scope == 'kecamatan'){
            if(pelangganDetail[latest]?.kelurahanId == data.IDKelurahan){
                pelangganDetail[latest].total = pelangganDetail[latest].total + Number(data.Total);
                pelangganDetail[latest].totalTransaksi = pelangganDetail[latest].totalTransaksi + Number(data.TotalTransaksi)
                pelangganDetail[latest].unitUsaha.push({
                    label: data.UnitUsaha,
                    id: data.UnitUsahaId
                })
            }else{
                pelangganDetail.push({
                    scope: 'root',
                    totalTransaksi: Number(data.TotalTransaksi),
                    total: Number(data.Total),
                    kelurahan:data.Kelurahan,
                    kelurahanId: data.IDKelurahan,
                    unitUsaha:[
                        {
                            label: data.UnitUsaha,
                            id: data.UnitUsahaId
                        }
                    ]
                })
                latest = latest+1;
            }
        }else if(scope == 'kelurahan'){
            if(pelangganDetail[latest]?.nama == data.IDKelurahan){
                pelangganDetail[latest].total = pelangganDetail[latest].total + data.Total;
                pelangganDetail[latest].totalTransaksi = pelangganDetail[latest].totalTransaksi + data.TotalTransaksi
                pelangganDetail[latest].unitUsaha.push({
                    label: data.UnitUsaha,
                    id: data.UnitUsahaId
                })
            }else{
                pelangganDetail.push({
                    scope: 'root',
                    totalTransaksi: Number(data.TotalTransaksi),
                    nama:data.Nama,
                    total: data.Total,
                    unitUsaha:[
                        {
                            label: data.UnitUsaha,
                            id: data.UnitUsahaId
                        }
                    ]
                })
                latest = latest+1;
            }
        }

    })
    return {
        penjualan: penjualan,
        total: total,
        produkTerlaris: produkTerlaris,
        visitor: dashboard.data.visitor,
        pengeluaran: dashboard.data.pelangganStat,
        totalStok: dashboard.data.totalStok,
        totalProdukTerjual: totalProdukTerjual,
        pelangganStat: dashboard.data.pelangganStat,
        pelangganDetail: pelangganDetail,
        scope: scope
    }
}

export async function getServerSideProps({req,res}){
    let token = getCookie('token',{req,res});
    let admin = '';
    if(token == undefined){
        return {
            redirect: {
                permanent: false,
                destination: "/auth",
            },
            props:{}
            };
    }

    await checkPrivilege(token).then((r)=>{
        admin = r;
    }).catch((e)=>{
        console.log(e)
        return {
            redirect: {
                permanent: false,
                destination: "/auth",
            },
            props:{
            }
        };
    });

    let dashboard = await axios.post('/api/admin/dashboard',{        
            "from":"2018-01-01",
            "to":"",
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
    }).catch((e)=>{
        console.log(e)
    })
    let unitUsaha = await getAllUnitUsahaAdmin(token)
    let provinsi = await getAllProvinsi();
    return {
        props:{
            isSuper: admin.adminLevel == '1' ? true : false,
            admin: admin,
            data:formatDashboardData(dashboard),
            options: {
                unitUsaha: unitUsaha,
                provinsi: provinsi
            }
        }
    }
}

export default function Dashboard({isSuper,admin,data, options}){
    let [loading, setLoading] = useState(false)
    const token = getCookie('token');

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
        let dashboard = await axios.post('/api/admin/dashboard',filterData,{
        headers:{
            Authorization: 'Bearer '+token,
        },
        withCredentials:true
    })
        setData(formatDashboardData(dashboard))
    }
    let handleDownload = async ()=>{
        let dashboard = await axios.post('/api/admin/dashboard/download',filterData,{
        headers:{
            Authorization: 'Bearer '+token,
        },
        withCredentials:true,
        responseType: 'blob'
    }).then((r)=>{
        fileDownload(r.data, 'dashboard.xlsx');
    })
    }
    const [openFilter, setOpenFilter] = useState(false);

    let TABLEHEAD = [
        {value: 'No',align: 'left'},
        {value: 'Lokasi',align: 'left'},
        {value: 'Jumlah Transaksi',align: 'left'},
        {value: 'Total Transaksi',align: 'left'},
        {value: 'Unit Usaha',align: 'left'},
    ]

    let SECONDTABLEHEAD = [
        {value: 'No',align: 'left'},
        {value: 'Nama',align: 'left'},
        {value: 'Jumlah Transaksi',align: 'left'},
        {value: 'Total Transaksi',align: 'left'},
        {value: 'Unit Usaha',align: 'left'},
    ]

    let [tableHead, setTableHead] = useState(TABLEHEAD);

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
                            setFilter(filter);
                            return unitUsahaData
                        }}
                        />
                    </FormControl>
                    <Button color="success" sx={{marginTop:'1em'}} variant="contained" onClick={()=>{handleChange()}}>Terapkan Filter</Button>
                </DialogContent>
            </Dialog>
                
                <AdminLayout isSuper={isSuper} admin={admin} handleLoading={loading}>
                    <Container maxWidth={'lg'} sx={{justifyContent:'center'}}>
                                <Box sx={{display:'flex',marginBottom:'1em',width:'100%', flexDirection:'row', justifyContent:'space-between'}}>
                                <Typography variant="h3" color={'#94B60F'} sx={{textDecoration:'underline'}} fontWeight={400}>
                                    Dashboard
                                </Typography>
                                <Box sx={{display:'flex',marginBottom:'1em',width:'100%', height:'100%', gap:'1em', flexDirection:'row', justifyContent:'flex-end'}}>
                                    <Button variant="contained" color="success" sx={{height:'0',marginY:'auto'}} onClick={()=>{handleDownload()}} startIcon={<ArrowDownward></ArrowDownward>}>
                                        Export Ke Excel
                                    </Button>
                                    <Button variant="contained" color="success" sx={{height:'0',marginY:'auto'}} onClick={()=>{setOpenFilter(true)}} startIcon={<FilterAlt></FilterAlt>}>
                                        Filter
                                    </Button>
                                </Box>
                                </Box>
                        <Grid container>

                            <Grid item xs={'12'}>
                                <Card sx={{height:'50vh',padding:'1em'}}>
                                    <CustomBarChart chartTitle={'Keuangan'} dataset={dashboardData?.penjualan} color={['#049ffb','#58B63B']}></CustomBarChart>
                                </Card>
                            </Grid>  
    
                            <Grid item xs={'12'} sx={{marginTop:'1em'}}>
                                <Box sx={{justifyContent:'space-between', flexDirection:'row', display:'flex', gap:'1em', flexWrap:'wrap'}}>
                                    <Card sx={{width:{
                                        xs:'100%',
                                        md:'43%',
                                        lg: '20%'
                                    },flexGrow:'1',padding:'1em'}}>
                                        <Typography sx={{fontWeight:'600'}}>
                                            Pengunjung
                                        </Typography>
                                        {dashboardData?.visitor[0]?.total}
                                    </Card>
                                    <Card sx={{width:{
                                        xs:'100%',
                                        md:'43%',
                                        lg: '20%'
                                    },flexGrow:'1',padding:'1em'}}>
                                        <Typography sx={{fontWeight:'600'}}>
                                            Pelanggan
                                        </Typography>
                                        {dashboardData?.pelangganStat}
                                    </Card>
                                    <Card sx={{width:{
                                        xs:'100%',
                                        md:'43%',
                                        lg: '20%'
                                    },flexGrow:'1',padding:'1em'}}>
                                        <Typography sx={{fontWeight:'600'}}>
                                            Jumlah Produk Terjual
                                        </Typography>
                                        {dashboardData?.totalProdukTerjual}
                                    </Card>
                                    <Card sx={{width:{
                                        xs:'100%',
                                        md:'43%',
                                        lg: '20%'
                                    },flexGrow:'1',padding:'1em'}}>
                                    <Typography sx={{fontWeight:'600'}}>
                                        Stok
                                    </Typography>
                                        {dashboardData?.totalStok[0]?.total}
                                    </Card>
                                </Box>
                            </Grid>

                            <Grid item xs={'12'} sx={{
                                paddingRight:{
                                    xs:'2em',
                                    md:'0'
                                }
                            }}>
                                <Box sx={{width:'auto',my:'1em',display:'flex',flexGrow:'1', gap:'1em',flexDirection:{
                                    xs:'column',
                                    md:'row'
                                }}}>
                                    <Card sx={{height:'300px',width:'100%',padding:'1em'}}>
                                        <CustomLineChart chartTitle={'Penjualan'} dataset={dashboardData?.total}></CustomLineChart>
                                    </Card>
                                
                                    <Card sx={{height:'300px',width:'100%',padding:'1em'}}>
                                        <CustomBarChart axis="y" chartTitle={'Unit usaha dengan produk terlaris'} dataset={dashboardData?.produkTerlaris} color={['#049ffb','#58B63B']}></CustomBarChart>
                                    </Card>
                                </Box>
                            </Grid>
                            
                            <Grid item xs={'12'} sx={{marginBottom:'3em'}}>
                                <Paper sx={{padding:'1em'}}>
                                    <Button onClick={()=>{
                                        setFilter({"from":"2018-01-01",
                                        "to":"2025-01-01",
                                        "kelurahan":'',
                                        "unitUsaha":'',
                                        "kecamatan":'',
                                        "kota":'',
                                        "provinsi":''});
                                        setTableHead(TABLEHEAD)
                                        handleChange()
                                    }} variant="contained" color="success">
                                        Reset Filter
                                    </Button>
                                    <TableContainer sx={{width:'100%'}}>
                                        <Table>
                                            <CustomTableHead tableHead={tableHead}>

                                            </CustomTableHead>
                                            {
                                                dashboardData?.pelangganDetail?.map((data,index)=>{
                                                    return (
                                                        <TableRow sx={{width:'100%'}}>
                                                            <TableCell>
                                                                    {index+1}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button onClick={()=>{
                                                                    let filter = filterData;
                                                                    if(dashboardData.scope == 'global'){
                                                                        filter.provinsi = data.provinsiId
                                                                    }
                                                                    if(dashboardData.scope == 'provinsi'){
                                                                        filter.kota = data.kotaId
                                                                    }
                                                                    if(dashboardData.scope == 'kota'){
                                                                        filter.kecamatan = data.kecamatanId
                                                                    }
                                                                    if(dashboardData.scope == 'kecamatan'){
                                                                        filter.kelurahan = data.kelurahanId
                                                                        setTableHead(SECONDTABLEHEAD)
                                                                    }
                                                                    setFilter(filter);
                                                                    handleChange()
                                                                }} color="success">
                                                                    {dashboardData.scope == 'global' ? data.provinsi : dashboardData.scope == 'provinsi' ? data.kota : dashboardData.scope == 'kota' ? data.kecamatan : dashboardData.scope == 'kecamatan' ? data.kelurahan : dashboardData.scope == 'kelurahan' ? data.nama : ''}
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell>
                                                                {data.total}
                                                            </TableCell>
                                                            <TableCell>
                                                                {data.totalTransaksi}
                                                            </TableCell>
                                                            <TableCell>
                                                                {data?.unitUsaha.map((unit)=>{
                                                                
                                                                    return (
                                                                        <Button onClick={()=>{
                                                                            let filter = filterData;
                                                                            filter.unitUsaha = unit.id
                                                                            setFilter(filter);
                                                                            handleChange()
                                                                        }} color="success">
                                                                            {unit.label}
                                                                        </Button>
                                                                    )
                                                                })}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                            
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                        </Grid>
                        
                    </Container>
                </AdminLayout>
        </>
    )
}