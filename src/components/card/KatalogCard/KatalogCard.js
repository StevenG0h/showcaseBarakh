import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {formatCurrency} from "../../../helper/currency";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"
import Image from "next/image";
import style from "./slider.module.css"
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { getCookie, setCookie } from "cookies-next";
import { useState } from "react";
import { ConfirmDialog } from "../../dialog/ConfirmDialog";


export default function KatalogCard({style, row}){
    const router = useRouter();
    let {id, product_images, productName, productDesc, productPrice, unit_usaha} = row;
    const settings = {
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        verticalSwiping: false,
        accessibility: false  
    };

    function productDetail(id){
        router.push('/detail-produk/'+id);
    }

    function addItem(data){
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
            console.log(cookieDatas);
        }
    }

    let [newTransactionStatus, setNewTransactionStatus] = useState(false);
    let handleChangeStatus = (data)=>{
        addItem(data)
        setNewTransactionStatus(true)
    }
    let handleCloseDialog = ()=>{
        setNewTransactionStatus(false)
    }
    let msg = 'Produk yang anda pilih sudah masuk ke keranjang, ingin ke halaman checkout?'

    return(
        <div className={style.card}>
            <ConfirmDialog onConfirm={()=>{router.replace('/cart')}} onCancel={()=>{handleCloseDialog()}} msg={msg} open={newTransactionStatus}></ConfirmDialog>
        <div className={style.imageCarousel}>
            <Slider {...settings}>
                {
                    product_images.map((image)=>{
                        return <img  src={process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/product/'+image.path} alt="Gambar" className={style.image}/>
                    })
                }
            </Slider>
        </div>
        <div className={style.caption}>
            <p className={style.kategoriProduct}>{unit_usaha.usahaName}</p>
            <p className={style.titleCard}>{productName}</p>
            <p className={style.price}>Harga : <span className={style.nominal}>{formatCurrency(productPrice)}</span></p>
            <p className={style.descriptionCard}>{
                productDesc
            }</p>
            <div className={style.directButton}>
                <button onClick={()=>{productDetail(id)}} className={style.detil}>Selengkapnya</button>
                <button onClick={()=>handleChangeStatus(row)} className={style.cart}><FontAwesomeIcon icon={faCartShopping} /></button>
            </div>
        </div>
    </div>
    )
}