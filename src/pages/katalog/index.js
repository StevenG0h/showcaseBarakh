import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import KatalogCard from "../../components/card/KatalogCard/KatalogCard";
import Ballot from "@mui/icons-material/Ballot";
import Filter from "@mui/icons-material/Filter";
import Search from "@mui/icons-material/Search";
import style from "./katalog.module.css";
import { Poppins } from 'next/font/google'
import axios from "../../utils/axios";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, Collapse, FormControl, Grid, IconButton, InputBase, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SvgIcon, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";
import WhatsApp from "../../components/Whatsapp/WhatsApp"

import {useState} from "react";

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
  })

export async function getServerSideProps({context}){
    let produk = await axios.get('/api/produk');
    let unitUsaha = await axios.get('/api/unit-usaha')
    return {
        props:{
            products:produk.data.data.data,
            unitUsaha: unitUsaha.data.data.data
        }
    }
}

const Katalog = ({products, unitUsaha}) => {
    let [product, setProducts] = useState(products);
    let [search, setSearch] = useState({
        id:'all',
        orderBy:'desc',
        keyword:'',
        harga:''
    });

    let [collapse, setCollapse] = useState(false)

    let handleSearch = async (data)=>{
        let unitUsaha = await axios.post('/api/produk/search',data);
        setProducts(unitUsaha?.data?.data)
    }

    const theme = createTheme({
        palette:{
          main:'#94B60F',
          success: {
            main:'#94B60F',
            contrastText: '#ffffff'
          }
        }
      })

    return (
        <ThemeProvider theme={theme}>
            <main className={poppins.className}>
        <Header/>
            <div className={style.container}>
                <div className={style.containerBase}>
                    <div className={style.banner}>
                    </div>
                    <Box sx={{display:'flex', gap:'1em', alignItems:'start', justifyContent:'space-between',flexDirection:{
                        lg:'row',
                        xs:'column'
                    }}}>
                        <Typography variant="h4" sx={{color:'#94B60F'}} fontWeight={600} noWrap>
                            Katalog Produk
                        </Typography>
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
                            <IconButton onClick={()=>handleSearch(search)} variant="contained" color="success" sx={{height:'100%',paddingY:'0.5em', borderRadius:'0'}}>
                                <Search></Search>
                            </IconButton>
                        </Card>
                        {/* <Button color="success" variant="contained" sx={{borderRadius:'5em'}}>
                            Produk Terbaru
                        </Button>
                        <Button  sx={{borderRadius:'5em',color:'white'}}>
                            Harga Tertinggi
                        </Button>
                        <Button   sx={{borderRadius:'5em',color:'white'}}>
                            Harga Terendah
                        </Button> */}
                    </Box>
                    <Button onClick={()=>{setCollapse(!collapse)}} color="success" variant="contained" sx={{width:'fit-content', borderRadius:'5em',display:{
                        lg:'none'
                    }}} startIcon={<Filter></Filter>}>
                        Filter
                    </Button>
                    <Box sx={{display:'flex',justifyContent:'space-between',flexDirection:{
                        lg:'row',
                        xs:'column'
                    },  gap:'1em'}}>
                            <Collapse in={collapse} sx={{
                                marginBottom:'1em',display:{
                                    lg:'none',
                                    xs:'flex'
                                },width:'100%', maxWidth:{
                                lg:'25%'
                            }}}>
                                    <List sx={{backgroundColor:'white',borderRadius:'1.5em',width:'100%',height:'fit-content'}}>
                                        
                                        <ListItem sx={{flexDirection:'row'}}>
                                            <ListItemButton onClick={()=>{
                                                let data = search;
                                                data.id = 'all';
                                                setSearch(data);
                                                handleSearch(search);
                                            }}>
                                                <Box sx={{width:'2.5em',aspectRatio:'1/1',marginRight:'0.5em',padding:0, borderRadius:'100%',overflow:'hidden',display:'flex',justifyContent:"start",alignItems:"center",backgroundColor:'#ffffff'}}>
                                                    <Ballot color="success" ></Ballot>
                                                </Box>
                                                                    
                                                <ListItemText sx={{color:search.id === 'all' ? '#94B60F' : '#333333'}}>
                                                    <Typography noWrap sx={{fontWeight:search.id === 'all' ? '600' : '300'}}>
                                                    Semua Produk
                                                    </Typography>
                                                </ListItemText>
                                            </ListItemButton>
                                        </ListItem>
                                        {
                                            unitUsaha.map((map)=>{
                                                
                                                    
                                                    
                                                    return (
                                                        <ListItem >
                                                            <ListItemButton onClick={()=>{
                                                            let data = search;
                                                            data.id = map.id;
                                                            setSearch(data);
                                                            handleSearch(search)
                                                        }}>
                                                                <Box sx={{width:'2.5em',aspectRatio:'1/1',marginRight:'0.5em',padding:0, borderRadius:'100%',overflow:'hidden',display:'flex',justifyContent:"center",alignItems:"center",backgroundColor:'#ffffff'}}>
                                                                    <img style={{width:'90%',objectFit:'contain'}} src={process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/unitUsaha/logo/'+map.unitUsahaLogo}/>
                                                                </Box>
                                                                <ListItemText sx={{color:search.id === map.id ? '#94B60F' : '#333333'}}>
                                                                    <Typography noWrap sx={{fontWeight:search.id === map.id ? '600' : '300'}}>
                                                                        {map.usahaName}
                                                                    </Typography>
                                                                </ListItemText>
                                                            </ListItemButton>
                                                        </ListItem>
                                                    )
                                            })
                                        }
                                        
                                    </List>

                            </Collapse>
                            
                        <List sx={{display:{
                            lg:'block',
                            xs:'none'
                        },backgroundColor:'white',borderRadius:'1.5em',width:'100%',maxWidth:{
                            lg:'25%'
                        },height:'fit-content'}}>
                            
                            <ListItem sx={{flexDirection:'row'}}>
                                <ListItemButton onClick={()=>{
                                    let data = search;
                                    data.id = 'all';
                                    setSearch(data);
                                    handleSearch(search);
                                }}>
                                    <Box sx={{width:'2.5em',aspectRatio:'1/1',marginRight:'0.5em',padding:0, borderRadius:'100%',overflow:'hidden',display:'flex',justifyContent:"start",alignItems:"center",backgroundColor:'#ffffff'}}>
                                        <Ballot color="success" ></Ballot>
                                    </Box>
                                                        
                                    <ListItemText sx={{color:search.id === 'all' ? '#94B60F' : '#333333'}}>
                                        <Typography noWrap sx={{fontWeight:search.id === 'all' ? '600' : '300'}}>
                                        Semua Produk
                                        </Typography>
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                            {
                                unitUsaha.map((map)=>{
                                    
                                        
                                        
                                        return (
                                            <ListItem >
                                                <ListItemButton onClick={()=>{
                                                let data = search;
                                                data.id = map.id;
                                                setSearch(data);
                                                handleSearch(search)
                                            }}>
                                                    <Box sx={{width:'2.5em',aspectRatio:'1/1',marginRight:'0.5em',padding:0, borderRadius:'100%',overflow:'hidden',display:'flex',justifyContent:"center",alignItems:"center",backgroundColor:'#ffffff'}}>
                                                        <img style={{width:'90%',objectFit:'contain'}} src={process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/unitUsaha/logo/'+map.unitUsahaLogo}/>
                                                    </Box>
                                                    <ListItemText sx={{color:search.id === map.id ? '#94B60F' : '#333333'}}>
                                                        <Typography noWrap sx={{fontWeight:search.id === map.id ? '600' : '300'}}>
                                                            {map.usahaName}
                                                        </Typography>
                                                    </ListItemText>
                                                </ListItemButton>
                                            </ListItem>
                                        )
                                })
                            }
                            
                        </List>
                        <Box container sx={{ justifyContent:'start',gap:'1em', display:'flex', flexWrap:'wrap'}}>
                            {
                                product.length != 0 ? product.map((product)=>{
                                    return (
                                        <Box item key={product.id} sx={{
                                            flexGrow:{
                                                xs:'1',
                                                lg:'0'
                                            },
                                            width:{
                                                lg:'31.5%',
                                                xs:'48%'
                                            },
                                            maxWidth:'50em'
                                        }} >
                                            <KatalogCard style={style} row={product}></KatalogCard>
                                        </Box>
                                    )
                                }) :
                                <Box sx={{display:'flex', flexDirection:'column', width:'100%'}}>
                                <Typography sx={{color:'white'}} marginBottom={'-12%'} variant="h4" fontWeight={600} textAlign={'center'}>
                                    Produk Tidak Ditemukan
                                </Typography>
                                <img style={{width:{
                                    lg:'60%',
                                    xs:'100%'
                                },margin:'auto'}} src={'http://localhost:3000/assets/image/Business, Startup, workflow, error _ exhaustion, exhausted, work, laptop, computer, support 1.png'}></img>
                                </Box>
                            }
                        </Box>
                    </Box>
                    
                </div>
            </div>
        <Footer/>
        <WhatsApp/>
        </main>
        </ThemeProvider>
        
    )
}

export default Katalog;