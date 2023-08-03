
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import style from "./detail.module.css";
import Image from "next/image";
import imageDetail from "../../../public/assets/images/imageDetail.png";
import SliderDetail from "../../components/sliderDetailKategori/slider";
import ImageDetail from "../../components/ImageDetailUsaha/ImageDetail";
import { Poppins } from 'next/font/google';
import WhatsApp from "../../components/Whatsapp/WhatsApp"

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
    })

const detailKategori = () => {
    return (
        <main className={poppins.className}>
        <Header/>
            <div className={style.container}>
                <div className={style.containerDetail}>                    
                    <p className={style.titleUnitUsaha}>Unit Usaha : Rumah Jahit</p>
                    <Image className={style.imageDetail} src={imageDetail} alt="Gambar"/>
                    <p className={style.description}>Pesantren Ibnu Al - Mubarok memiliki salah satu unit usaha yaitu Rumah Jahit Buatan Tangan seperti Totebag, Kotak Pencil, Goodie bag, dan masih banyak lagi hasil jahitan yang terbuat dari barang daur ulang dan merupakan produk natural. Pengelolaan produk rumah jahit ini diatur orang tua murid , masyarakat sekirat, dan disabilitas yang terkait dengan Pertamina Hulu Rokan.</p>
                    <ImageDetail/>
                </div>    
            </div>
        <Footer/>
        <WhatsApp/>
        </main>
    )
}

export default detailKategori;