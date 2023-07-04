import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import style from "./product.module.css"
import imageDetail from "../../../public/assets/images/imgDetailProduct.png"
import Image from "next/image";
import {formatCurrency} from "../../helper/currency";
import { Poppins } from 'next/font/google'
import axios from "../../utils/axios";
import { setCookie, getCookie } from "cookies-next";

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

    let handleCart = ()=>{
        let cookie = getCookie('barakh-cart-cookie');
        if(cookie === undefined){
            let cart = [
                {productId: data.id, item: 1}
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
                cookieDatas.push({productId: data.id, item: 1});
                setCookie('barakh-cart-cookie',cookieDatas);
            }
            console.log(cookieDatas);
        }
    }

    return (
        <>
            <main className={poppins.className}>
            <Header/>
                    <div className={style.container}>
                        <div className={style.containerDetailProduct}>
                            <div className={style.fieldImage}>
                                <Image src={imageDetail} alt="Gambar" className={style.imageDetail} />
                            </div>
                            <div className={style.fieldDetailProduct}>
                                <p className={style.titleProduct}>{data.productName}</p>
                                <p className={style.stockProduct}>Stock : <span className={style.stockAmount}>{data.productStock} Pcs</span></p>
                                <p className={style.priceProduct}>Harga : <span className={style.priceAmount}>{formatCurrency(Number(data.productPrice))}</span></p>
                                <p className={style.unitUsaha}>Unit Usaha : <span className={style.nameUnitUsaha}>{data.unit_usaha.usahaName}</span></p>
                                {/* <p className={style.weightProduct}>Berat : <span className={style.weightAmount}>0.1 Kg</span></p> */}
                                <p className={style.descriptionProduct}>Deskripsi : <span className={style.description}><br />{data.productDesc}</span></p>
                                <div className={style.buttonContainer}>    
                                    <button className={style.cartButton}>Rating Untuk Produk Kami</button>
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