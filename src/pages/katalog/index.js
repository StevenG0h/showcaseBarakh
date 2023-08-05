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
import { Box, Grid, Typography } from "@mui/material";
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
            console.log(unitUsaha);
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
                    <div className={style.containerKatalog}>
                        <ul className={style.ul}>
                            <li  className={style.li}><button type="button" onClick={()=>handleFilter('all')} style={{cursor: 'pointer',color: filter === 'all' ? '#94B60F' : '#ffffff',backgroundColor:'transparent',boxShadow:'none',border:'none'}} className={style.a} href="">Semua</button></li>
                            {
                                unitUsaha.map((map)=>{
                                    return (
                                        <li className={style.li}><button type="button" onClick={()=>handleFilter(map.id)} style={{cursor: 'pointer',color: filter === map.id ? '#94B60F' : '#ffffff',backgroundColor:'transparent',boxShadow:'none',border:'none'}} className={style.a} href="">{map.usahaName}</button></li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <Grid container sx={{margin:'-0.5em'}}>
                        {
                            product.length != 0 ? product.map((product)=>{
                                return (
                                    <Grid item xs={6} sm={4} lg={3} key={product.id} sx={{padding:'0.5em'}}>
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
                </div>
            </div>
        <Footer/>
        <WhatsApp/>
        </main>
    )
}

export default Katalog;