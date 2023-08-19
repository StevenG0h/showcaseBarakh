import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import KatalogCard from "../../components/card/KatalogCard/KatalogCard";
import style from "./katalog.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import Keripik from "../../../public/assets/images/Keripik.png";
import Image from "next/image";
import { Poppins } from 'next/font/google'
import axios from "../../utils/axios";
import { Box, Collapse, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SvgIcon, Typography } from "@mui/material";
import WhatsApp from "../../components/Whatsapp/WhatsApp"
import {useState} from "react";

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
  })

export async function getServerSideProps({context}){
    let produk = await axios.get('/api/produk');
    console.log(produk.data);
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
    let [filter, setFilter] = useState('all');

    let handleFilter = async (data)=>{
        if(data != 'all'){
            let unitUsaha = await axios.get('/api/produk/withFilter/'+data);
            setProducts(unitUsaha?.data.data)
        }else{
            let unitUsaha = await axios.get('/api/produk/');
            setProducts(unitUsaha?.data?.data.data)
        }
        setFilter(data);
    }

    return (
        <main className={poppins.className}>
        <Header/>
            <div className={style.container}>
                <div className={style.containerBase}>
                    <div className={style.banner}>
                    </div>
                    <Box sx={{display:'flex',justifyContent:'center',flexDirection:{
                        lg:'row',
                        xs:'column'
                    },  gap:'1em'}}>
                        <List sx={{backgroundColor:'white',borderRadius:'1.5em',width:'100%',maxWidth:{
                            lg:'25%',display:{
                                sm:'none'
                            }
                        }}}>
                            <ListItem sx={{flexDirection:'row'}}>
                                <ListItemButton onClick={()=>handleFilter('all')}>
                                    <ListItemText sx={{color:filter === 'all' ? '#94B60F' : '#333333'}}>
                                        <Typography noWrap sx={{fontWeight:filter === 'all' ? '600' : '300'}}>
                                        Semua Produk
                                        </Typography>
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                            {
                            unitUsaha.map((map)=>{
                                        
                                            <li className={style.li}><button type="button" onClick={()=>handleFilter(map.id)} style={{cursor: 'pointer',color: filter === map.id ? '#94B60F' : '#ffffff',backgroundColor:'transparent',boxShadow:'none',border:'none'}} className={style.a} href=""></button></li>
                                        
                                        return (
                                            <ListItem >
                                                <ListItemButton onClick={()=>handleFilter(map.id)}>
                                                    <Box sx={{width:'2.5em',aspectRatio:'1/1',marginRight:'0.5em',padding:0, borderRadius:'100%',overflow:'hidden',display:'flex',justifyContent:"center",alignItems:"center",backgroundColor:'#ffffff'}}>
                                                        <img style={{width:'90%',objectFit:'contain'}} src={process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/unitUsaha/logo/'+map.unitUsahaLogo}/>
                                                    </Box>
                                                    <ListItemText sx={{color:filter === map.id ? '#94B60F' : '#333333'}}>
                                                        <Typography noWrap sx={{fontWeight:filter === map.id ? '600' : '300'}}>
                                                            {map.usahaName}
                                                        </Typography>
                                                    </ListItemText>
                                                </ListItemButton>
                                            </ListItem>
                                        )
                                })
                            }
                            
                        </List>
                        <Grid container sx={{ justifyContent:'space-between'}}>
                            {
                                product.length != 0 ? product.map((product)=>{
                                    return (
                                        <Grid item xs={6} sm={6} lg={4} key={product.id} sx={{padding:'0.5em'}}>
                                            <KatalogCard style={style} row={product}></KatalogCard>
                                        </Grid>
                                    )
                                }) :
                                <Box sx={{display:'flex', flexDirection:'column', width:'100%'}}>
                                <img style={{width:'45%',margin:'auto',marginTop:'-8em'}} src={'http://localhost:3000/assets/image/Business, Startup, workflow, error _ exhaustion, exhausted, work, laptop, computer, support 1.png'}></img>
                                <Typography sx={{color:'white'}} variant="h6" textAlign={'center'}>
                                    Produk kosong
                                </Typography>
                                </Box>
                            }
                        </Grid>
                    </Box>
                    
                </div>
            </div>
        <Footer/>
        <WhatsApp/>
        </main>
    )
}

export default Katalog;