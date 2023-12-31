import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import style from "./product.module.css"
import Image from "next/image";
import {formatCurrency} from "../../helper/currency";
import { Poppins } from 'next/font/google'
import axios from "../../utils/axios";
import { setCookie, getCookie } from "cookies-next";
import  RatingModal  from "../../components/Rating/rating_modal";
import  RatingLabel  from "../../components/Rating/rating_label";
import {useState} from "react";
import { ConfirmDialog } from "../../components/dialog/ConfirmDialog";
import { useRouter } from "next/router";
import Head from "next/head";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
    })

export async function getServerSideProps({query}){
    let product = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'/api/produk/'+query.productId);
    return{
        props:{
            data:product.data
        }
    }
}

const detailProduct = ({data}) => {
    const router = useRouter();
    let handleCart = ()=>{
        let cookie = getCookie('barakh-cart-cookie');
        if(cookie === undefined){
            let cart = [
                {productId: data.id, item: 1, productData: data}
            ]
            setCookie('barakh-cart-cookie',cart);
        }else{
            let cookieDatas = JSON.parse(cookie);
            let isInCart = false;
            cookieDatas.map((cookieData)=>{
                if(data.id === cookieData.productId){
                    isInCart = true;
                }
            })
            if(isInCart == false){
                cookieDatas.push({productId: data.id, item: 1, productData: data});
                setCookie('barakh-cart-cookie',cookieDatas);
            }
        }
        setOpenTransaction(true);
    }

    const [open, setOpen] = useState(false)
    const [openTransaction, setOpenTransaction] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
    };

    return (
        <>
            <Head>
                <title>Albarakh | Detail Produk</title>
            </Head>
            <main className={poppins.className}>
            <Header/>
                <ConfirmDialog onConfirm={() => { router.replace('/cart') }} onCancel={() => { setOpenTransaction(false) }} msg={'Produk berhasil ditambahkan ke keranjang, anda ingin mengakses keranjang?'} open={openTransaction}></ConfirmDialog>
                    
                    <div className={style.container}>
                    <Box sx={{color:'#ffffff',marginBottom:'1em'}}>
                            <Breadcrumbs sx={{color:'#ffffff'}} aria-label="breadcrumb">
                                <Link sx={{color:'#ffffff'}} underline="hover" color="inherit" href="/katalog">
                                    Katalog Produk
                                </Link>
                                <Typography sx={{color:'#D5F06B'}}>{data.productName}</Typography>
                            </Breadcrumbs>
                        </Box>
                        <RatingModal id={data.id} open={open} onClose={handleClose}></RatingModal>
                        <div className={style.containerDetailProduct}>
                            
                            <div className={style.fieldImage}>
                                <img src={process.env.NEXT_PUBLIC_BACKEND_URL+"/storage/product/"+data.product_images[0].path} alt="Gambar" className={style.imageDetail} />
                            </div>
                            <div className={style.fieldDetailProduct}>
                                <p className={style.titleProduct}>{data.productName}</p>
                                 <RatingLabel value={data.rating} />
                                <p className={style.stockProduct}>Stock: <span className={style.stockAmount}>{data.productStock} {data?.satuan == undefined ? 'Pcs' : data.satuan}</span></p>
                                <p className={style.priceProduct}>Harga: 
                                    {
                                        data.productDisc != 0 && data.productDisc != null ? (
                                        <>
                                    
                                            <span style={{paddingRight:'1em'}} className={data.productDisc == 0 ? "" :style.nominal}>
                                                Rp.{formatCurrency(data.productPrice - ((data.productDisc / 100) * data.productPrice)) }
                                            </span>
                                            <span style={{textDecoration:'line-through'}}>Rp.{formatCurrency(Number(data.productPrice))}</span>
                                        </>
                                        ) : (
                                            <span className={style.priceAmount}>Rp.{formatCurrency(Number(data.productPrice))}</span>
                                        )
                                    }
                                    
                                    </p>
                                <p className={style.unitUsaha}>Unit Usaha: <span className={style.nameUnitUsaha}>{data.unit_usaha.usahaName}</span></p>
                                {/* <p className={style.weightProduct}>Berat : <span className={style.weightAmount}>0.1 Kg</span></p> */}
                                <p className={style.descriptionProduct}>Deskripsi : <span className={style.description}><br />{data.productDesc}</span></p>
                                <div className={style.buttonContainer}>    
                                    <button className={style.cartButton} onClick={handleClickOpen}>Rating Untuk Produk Kami</button>
                                    <button onClick={()=>{handleCart()}} className={style.cartButton}>Masukkan Ke Keranjang</button>
                                </div>
                            </div>
                        </div>
                    </div>
                <Footer/>
            </main>
        </>
    )
}   

export default detailProduct;