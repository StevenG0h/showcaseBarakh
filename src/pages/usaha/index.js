import Header from "../../components/header/header";
import Footer from "../../components/footer/footer"
import style from "./usaha.module.css"
import Image from "next/image";
import imageJeruk from "../../../public/assets/images/UsahaPertanian.png";
import Link from "next/link";
import { Poppins } from 'next/font/google'

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
    })


const UnitUsaha = ()=> {
    return (
        <main className={poppins.className}>
        <Header/>
            <div className={style.container}>
                <div className={style.containerUsaha}>
                    <p className={style.titleUnitUsaha}>Unit Usaha</p>
                    <div className={style.containerCard}>
                        <Link href="/detailKategori" className={style.link}>
                            <div className={style.cardUsaha}>
                                <Image src={imageJeruk} alt="Gambar" className={style.image}/>
                                <p className={style.titleCard}>Pertanian</p>
                                <p className={style.cardDescription}>Unit Usaha Ibnu Al-Mubarok dalam bidang pertanian menumbuh kan tanaman yang bermutu dan sehat menggunakan bibit unggul..  Selengkapnya</p>
                            </div>
                        </Link>
                        <Link href="/detailKategori" className={style.link}>
                            <div className={style.cardUsaha}>
                                <Image src={imageJeruk} alt="Gambar" className={style.image}/>
                                <p className={style.titleCard}>Pertanian</p>
                                <p className={style.cardDescription}>Unit Usaha Ibnu Al-Mubarok dalam bidang pertanian menumbuh kan tanaman yang bermutu dan sehat menggunakan bibit unggul..  Selengkapnya</p>
                            </div>
                        </Link>
                        <Link href="/detailKategori" className={style.link}>
                            <div className={style.cardUsaha}>
                                <Image src={imageJeruk} alt="Gambar" className={style.image}/>
                                <p className={style.titleCard}>Pertanian</p>
                                <p className={style.cardDescription}>Unit Usaha Ibnu Al-Mubarok dalam bidang pertanian menumbuh kan tanaman yang bermutu dan sehat menggunakan bibit unggul..  Selengkapnya</p>
                            </div>
                        </Link>
                        <Link href="/detailKategori" className={style.link}>
                            <div className={style.cardUsaha}>
                                <Image src={imageJeruk} alt="Gambar" className={style.image}/>
                                <p className={style.titleCard}>Pertanian</p>
                                <p className={style.cardDescription}>Unit Usaha Ibnu Al-Mubarok dalam bidang pertanian menumbuh kan tanaman yang bermutu dan sehat menggunakan bibit unggul..  Selengkapnya</p>
                            </div>
                        </Link>
                        <Link href="/detailKategori" className={style.link}>
                            <div className={style.cardUsaha}>
                                <Image src={imageJeruk} alt="Gambar" className={style.image}/>
                                <p className={style.titleCard}>Pertanian</p>
                                <p className={style.cardDescription}>Unit Usaha Ibnu Al-Mubarok dalam bidang pertanian menumbuh kan tanaman yang bermutu dan sehat menggunakan bibit unggul..  Selengkapnya</p>
                            </div>
                        </Link>
                        <Link href="/detailKategori" className={style.link}>
                            <div className={style.cardUsaha}>
                                <Image src={imageJeruk} alt="Gambar" className={style.image}/>
                                <p className={style.titleCard}>Pertanian</p>
                                <p className={style.cardDescription}>Unit Usaha Ibnu Al-Mubarok dalam bidang pertanian menumbuh kan tanaman yang bermutu dan sehat menggunakan bibit unggul..  Selengkapnya</p>
                            </div>
                        </Link>
                    </div>
                    
                </div>
            </div>
        <Footer/>
        </main>
    )
}

export default UnitUsaha;