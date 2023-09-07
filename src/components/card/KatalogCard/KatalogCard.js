import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { formatCurrency } from "../../../helper/currency";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"
import Image from "next/image";
import style from "./katalog.module.css"
import "./katalogs.css"
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { getCookie, setCookie } from "cookies-next";
import { useState } from "react";
import { ConfirmDialog } from "../../dialog/ConfirmDialog";
import RatingLabel from "../../Rating/rating_label";


export default function KatalogCard({ row, isCart=false, handleAddCart }) {
    const router = useRouter();
    let { id, product_images, productName, productDesc, productPrice, unit_usaha } = row;
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


    function productDetail(id) {
        router.push('/detail-produk/' + id);
    }

    function addItem(data) {
        let cookie = getCookie('barakh-cart-cookie');
        if (cookie === undefined) {
            let cart = [
                { productId: data.id, item: 1, productData: data }
            ]
            setCookie('barakh-cart-cookie', cart);
        } else {
            let cookieDatas = JSON.parse(cookie);
            let isInCart = false;
            cookieDatas.map((cookieData) => {
                if (data.id === cookieData.productId) {
                    isInCart = true;
                }
            })
            console.log(isInCart);
            if (isInCart == false) {
                let images = data.product_images.map(data=>{
                    return {
                        path: data.path
                    }
                })
                cookieDatas.push({ productId: data.id, item: 1, productData: {
                    id: data.id,
                    productName: data.productName,
                    productPrice: data.productPrice,
                    productStock: data.productStock,
                    product_images: [{path: images[0].path}],
                    unit_usaha_id: data.unit_usaha_id
                } });
                try{
                    setCookie('barakh-cart-cookie', cookieDatas);
                }catch(e){
                    console.log(e)
                }
            }
        }
        console.log(JSON.parse(getCookie('barakh-cart-cookie')))
    }

    let [newTransactionStatus, setNewTransactionStatus] = useState(false);
    let handleChangeStatus = (data) => {
        if(isCart){
            addItem(data)
            return router.reload();
        }
        addItem(data)
        setNewTransactionStatus(true)
    }
    let handleCloseDialog = () => {
        setNewTransactionStatus(false)
    }
    let msg = 'Produk yang anda pilih sudah masuk ke keranjang, ingin ke halaman checkout?'

    return (
        <div className={style.card} >
            <ConfirmDialog onConfirm={() => { router.replace('/cart') }} onCancel={() => { handleCloseDialog() }} msg={msg} open={newTransactionStatus}></ConfirmDialog>
            <div className={style.imageCarousel}>
                <div className="sliderKatalog">
                    <Slider {...settings}
                    >
                        {
                            product_images.map((image) => {
                                return <img src={process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/product/' + image.path} alt="Gambar" className={style.image} />
                            })
                        }
                    </Slider>
                </div>
            </div>
            <div className={style.caption}>
                <p className={style.kategoriProduct}>{unit_usaha.usahaName}</p>
                <p className={style.titleCard}>{productName}</p>
                <RatingLabel value={row.rating} />
                <p className={style.price}>Harga : <span className={style.nominal}>Rp.{formatCurrency(productPrice)}</span></p>
                {/* <p className={style.descriptionCard}>{
                    productDesc
                }</p> */}
                <div className={style.directButton}>
                    <button onClick={() => { productDetail(id) }} className={style.detil} >Selengkapnya</button>
                    <button onClick={() => handleChangeStatus(row)} className={style.cart}>
                        <ShoppingCartIcon fontSize='12px'></ShoppingCartIcon>
                    </button>
                </div>
            </div>
        </div>
    )
}