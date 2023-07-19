import style from "./pesantren.module.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import PesantrenImg from "../../../public/assets/images/PesantrenImg.png";
import PesantrenViMi from "../../../public/assets/images/PesantrenViMi.jpg";
import Image from "next/image";
// import { Typography } from "@mui/material";
import { Poppins } from 'next/font/google';
import WhatsApp from "../../components/Whatsapp/WhatsApp"

const poppins = Poppins({
    weight: '500',
    subsets: ['latin']
})

const Pesantren = () => {
    return (
        <main className={poppins.className}>
            <Header />
            <div className={style.container}>
                <div className={style.containerPesantren}>
                    <div className={style.colTentang}>
                        <p className={style.title}>Tentang Pesantren</p>
                        <div className={style.contentTentang}>
                            <Image src={PesantrenImg} alt="Gambar" className={style.image}/>
                            <div className={style.colDescription}>
                                <p className={style.description} >Pesantren Ibnu Al-Mubarok Pekanbaru, Riau awalnya bernama Ulil Albab di bawah Yayasan Ulil Albab. Pondok ini dirintis Oleh Jefri pada tahun 1998. Namun, sejak Juli 2019 hingga saat ini lembaga tersebut berubah nama menjadi Lembaga Pendidikan Ibnu Al-Mubarok dibawah Yayasan Ulil Albab yang diketuai Rinwiningsih</p>
                                <p className={style.description} >Pesantren Ibnu Al-Mubarok memiliki 250 anak didik mulai Raudhatuhul Atfal (Setara Taman Kanak-kanak), dan Madrasah Ibtidaiyah, dengan 21 tenaga pengajar. Rencananya, mulai tahun depan, Ponpes ini akan menerima juga anak didik untuk MTs atau SMP.</p>
                                <p className={style.description} >Ponpes Ibnu Al-Mubarok berhasil mengurai timbulan sampah jadi bernilai Ekonomis seperti kompos dari sampah-sampah tanaman, dan memiliki program unggulan yaitu Workshop Bank Sampah.</p>
                            </div>
                        </div>
                    </div>
                    <div className={style.rowVisiMisi}>
                        <div className={style.contentImage}>
                            <Image src={PesantrenViMi} alt="Gambar" className={style.imageViMi}/>
                        </div>
                        <div className={style.colViMi}>
                            <div className={style.colVisiMisi}>
                                <p className={style.title}>Visi</p>
                                <p className={style.visiDescription}>Mewujudkan generasi penghafal Al Qur’an yang mampu mengamalkan ulumuddin, berwawasan luas, mandiri dan berjiwa pemimpin.</p>
                            </div>
                            <div className={style.colVisiMisi}>
                                <p className={style.title}>Misi</p>
                                <ol className={style.ol}>
                                    <li className={style.li}>Menyelenggarakan program pendidikan tahfizhul qur'an.</li>
                                    <li className={style.li}>Menyelenggrakan program pendidikan ulumuddin dan pengetahuan umum.</li>
                                    <li className={style.li}>Menyelenggarakan program life skill dan leadership</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <WhatsApp />
        </main>
    )
}

export default Pesantren;