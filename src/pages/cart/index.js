import style from "./cart.module.css"
import { useState } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import imageCart from "../../../public/assets/images/cart.png";
import NoticeModal from "../../components/NoticeModal/notice_modal"
import Image from "next/image";
import Link from "next/link";
import { Poppins } from 'next/font/google'
import { getCookie } from "cookies-next";
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
    return {
        props:{
            data: productsData.data.data
        }
    }
}

const Cart = ({data}) => {

    let [product, setProduct] = useState(data);
    let [total, setTotal] = useState(0);

    const [showNotice, setShowNotice] = useState(false);
    
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
                                product.map((data)=>{
                                    return (
                                        <div className={style.fieldListProduct}>
                                            <input className={style.inputt} type="checkbox" />
                                            <div className={style.list}>
                                                <div className={style.image}>
                                                    <img src={process.env.NEXT_PUBLIC_BACKEND_URL+"/storage/product/"+data.product_images[0].path} alt="Gambar" className={style.imageCart} />
                                                </div>
                                                <div className={style.detailProductCart}>
                                                    <Link href="/detailProduct" className={style.link}>
                                                        <p className={style.titleProduct}>Goodie Bag Rajut</p>
                                                    </Link>
                                                    <div className={style.remaining}>
                                                        <p className={style.remainingCheck}>sisa {data.productStock}</p>
                                                        <p className={style.price}>{formatCurrency(Number(data.productPrice))}</p>
                                                    </div>
                                                    <div className={style.detailSetProduct}>
                                                        <button className={style.hapus}></button>
                                                        <div className={style.setAmount}>
                                                            <button className={style.kurang}>-</button>
                                                            <p className={style.amount}>1</p>
                                                            <button className={style.tambah}>+</button>
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