import style from "./cart.module.css"
import { useState } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import imageCart from "../../../public/assets/images/cart.png";
import NoticeModal from "../../components/NoticeModal/notice_modal"
import Image from "next/image";
import Link from "next/link";
import { Poppins } from 'next/font/google'
import { getCookie, setCookie } from "cookies-next";
import axios from "../../utils/axios";
import {formatCurrency} from "../../helper/currency";

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
})

export async function getServerSideProps({req,res}){
    let cookie = getCookie('barakh-cart-cookie',{req,res})
    cookie = JSON.parse(cookie);
    let products = cookie.map((data)=>{
        return data.productId
    })
    
    let productsData = await axios.post('/api/produk/get-cart',{data:products});
    let cart = [];
    cookie.map((data)=>{
        productsData.data.data.map((product)=>{
            if(data.productId === product.id){
                cart.push({
                    item: data.item,
                    product: product
                })
            }
        })
    })
    console.log(cart)
    return {
        props:{
            cart: cart,
            cookie: cookie
        }
    }
}

const Cart = ({cart,cookie}) => {

    let [cartList, setCart] = useState(cart);
    let [total, setTotal] = useState(0);

    const [showNotice, setShowNotice] = useState(false);
    
    const handleChangeItem = (id, change)=>{
        let newCartList = cartList.map((cart)=>{
            if(cart.product.id === id){
                cart.item+=change
                if(cart.item > 0 == false){
                    cart.item = 1;
                }
                let newCookie = cookie.map((map)=>{
                    if(map.productId === id){
                        map.item = cart.item
                    }
                    return map;
                })
                setCookie('barakh-cart-cookie',newCookie)
            }
            return cart
        })
        setCart(newCartList);
        
    }


    return (
        <main className={poppins.className}>
            <Header />
            <div className={style.container}>
                <div className={style.containerCart}>
                    <p className={style.title}>Keranjang</p>
                    <div className={style.topCart}>
                        <div className={style.pilih}>
                            <input className={style.input} type="checkbox" />
                            <p className={style.textPilih}>Pilih Semua</p>
                        </div>
                        <button className={style.buttonHapus}>Hapus</button>
                    </div>
                    <hr className={style.garis} />
                    <div className={style.mainCart}>
                        <div className={style.fieldList}>
                            {
                                cartList.map(({product,item})=>{
                                    return (
                                        <div key={product.id} className={style.fieldListProduct}>
                                            <input className={style.inputt} type="checkbox" />
                                            <div className={style.list}>
                                                <div className={style.image}>
                                                    <img style={{aspectRatio:'3/2', objectFit:'cover',margin:'auto'}} src={process.env.NEXT_PUBLIC_BACKEND_URL+"/storage/product/"+product.product_images[0].path} alt="Gambar" className={style.imageCart} />
                                                </div>
                                                <div className={style.detailProductCart}>
                                                    <Link href="/detailProduct" className={style.link}>
                                                        <p className={style.titleProduct}>{product.productName}</p>
                                                    </Link>
                                                    <div className={style.remaining}>
                                                        <p className={style.remainingCheck}>sisa {product.productStock}</p>
                                                        <p className={style.price}>{formatCurrency(Number(product.productPrice))}</p>
                                                    </div>
                                                    <div className={style.detailSetProduct}>
                                                        <button className={style.hapus}></button>
                                                        <div className={style.setAmount}>
                                                            <button onClick={()=>handleChangeItem(product.id,-1)} className={style.kurang}>-</button>
                                                            <p className={style.amount}>{item}</p>
                                                            <button onClick={()=>handleChangeItem(product.id,1)} className={style.tambah}>+</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            
                        </div>
                        <div className={style.ringkasanBelanja}>
                            <div className={style.descRingkasan}>
                                <p className={style.titleRingkasan}>Ringkasan Belanja</p>
                                <div className={style.detailPrice}>
                                    <div className={style.textTotal}>Total Belanja Anda : </div>
                                    <div className={style.total}>{formatCurrency(total)}</div>
                                </div>
                            </div>
                            <button className={style.buttonBuy} onClick={() => setShowNotice(true)}>Lanjutkan Pembayaran</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <NoticeModal isVisible={showNotice} CloseClick={() => setShowNotice(false)}/>
        </main>
    )
}

export default Cart;