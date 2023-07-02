import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import style from "./product.module.css"
import imageDetail from "../../../public/assets/images/imgDetailProduct.png"
import Image from "next/image";
import { Poppins } from 'next/font/google'

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
    })

const detailProduct = () => {
    return (
        <main className={poppins.className}>
            <Header/>
                <div className={style.container}>
                    <div className={style.containerDetailProduct}>
                        <div className={style.fieldImage}>
                            <Image src={imageDetail} alt="Gambar" className={style.imageDetail} />
                        </div>
                        <div className={style.fieldDetailProduct}>
                            <p className={style.titleProduct}>Goodie Bag Rajut</p>
                            <p className={style.stockProduct}>Stock : <span className={style.stockAmount}>15 Pcs</span></p>
                            <p className={style.priceProduct}>Harga : <span className={style.priceAmount}>Rp.20.000,00-</span></p>
                            <p className={style.unitUsaha}>Unit Usaha : <span className={style.nameUnitUsaha}>Rumah Jahit</span></p>
                            <p className={style.weightProduct}>Berat : <span className={style.weightAmount}>0.1 Kg</span></p>
                            <p className={style.descriptionProduct}>Deskripsi : <span className={style.description}><br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur.</span></p>
                            <div className={style.buttonContainer}>    
                                <button className={style.cartButton}>Rating Untuk Produk Kami</button>
                                <button className={style.cartButton}>Masukkan Ke Keranjang</button>
                            </div>
                        </div>
                    </div>
                </div>
            <Footer/>
        </main>
    )
}   

export default detailProduct;