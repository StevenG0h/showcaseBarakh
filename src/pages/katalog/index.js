import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import style from "./katalog.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import Keripik from "../../../public/assets/images/Keripik.png";
import Image from "next/image";
import { Poppins } from 'next/font/google'

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
  })

const Katalog = () => {
    return (
        <main className={poppins.className}>
        <Header/>
            <div className={style.container}>
                <div className={style.containerBase}>
                    <div className={style.banner}>
                    </div>
                    <div className={style.containerKatalog}>
                        <ul className={style.ul}>
                            <li className={style.li}><a className={style.a} href="">Terbaru</a></li>
                            <li className={style.li}><a className={style.a} href="">Populer</a></li>
                            <li className={style.li}><a className={style.a} href="">Kerajinan</a></li>
                            <li className={style.li}><a className={style.a} href="">Nuture</a></li>
                        </ul>
                    </div>
                    <div className={style.card}>
                        <div className={style.imageCarousel}>
                            <Image src={Keripik} alt="Gambar" className={style.image}/>
                        </div>
                        <div className={style.caption}>
                            <p className={style.kategoriProduct}>GALERI OLEH-OLEH</p>
                            <p className={style.titleCard}>Kerajinan</p>
                            <p className={style.price}>Harga : <span className={style.nominal}>Rp.25.000</span></p>
                            <p className={style.descriptionCard}>Keripik bayam menjadi salah satu cemilan baru yang diminati masyarakat karena bahan baku pembuatannya dapat dikembangkan pada daerah dataran tinggi ataupun daerah dataran rendah</p>
                            <div className={style.directButton}>
                                <a href="" className={style.detil}>Selengkapnya</a>
                                <a href="" className={style.cart}><FontAwesomeIcon icon={faCartShopping} /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <Footer/>
        </main>
    )
}

export default Katalog;