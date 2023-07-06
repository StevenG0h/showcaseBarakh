
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import style from './profile.module.css';
import Image from "next/image";
import profileImg from '../../../public/assets/images/Profile.png';
import { Poppins } from 'next/font/google'

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
  })
  

const Profile = () => {
    return (
        <main className={poppins.className}>
        <Header/>
            <div className={style.container}>
                <div className={style.containerProfile}>
                    <div className={style.fieldSekilas}>
                        <div className={style.fieldSekilasEx}>
                            <p className={style.sekilas} >Sekilas Tentang</p>
                            <div className={style.wrapDescSekilas} >
                                <p className={style.descriptions}>Al-Mubarok merupakan unit usaha yang dimiliki oleh pesantren Ibnu Al-Mubarkh, yang berdiri sejak 2020. Awal mula terbentuknya Unit Usaha ini adalah karena ide dari orang tua siswa dan pemilik yayasan. Al-Mubarakh bergerak di bidang agama dan produk yang dimiliki merupakan produk lokal yang ramah lingkungan.</p>
                            </div>
                        </div>
                    </div>
                    <div className={style.fieldProfileUmkm}>
                        <div className={style.profileUmkm}>
                            <p className={style.titleUnit}>Profil Unit Usaha</p>
                            <div className={style.underline}></div>
                        </div>
                    </div>
                    <div className={style.containerInformation}>
                        <Image src={profileImg} alt="Gambar"  className={style.profileImage}/>
                        <div className={style.wrapInformation}>
                            <div className={style.field1}>
                                <div className={style.columInfo}>
                                    <p className={style.titleInfo}>Nama UMKM</p>
                                    <p className={style.description}>Barakh Sentra Usaha A.S.I.K.</p>
                                </div>
                                <div className={style.columInfo}>
                                    <p className={style.titleInfo}>Tanggal Pendirian</p>
                                    <p className={style.description}>Sejak 2002</p>
                                </div>
                                <div className={style.columInfo}>
                                    <p className={style.titleInfo}>Email</p>
                                    <p className={style.description}>pondokpesantrenibnualmubarok@gmail.com</p>
                                </div>
                                <div className={style.columInfo}>
                                    <p className={style.titleInfo}>Alamat</p>
                                    <p className={style.description}>Jl. Sri Palas, Rumbai Bukit, Kec. Rumbai, Kota Pekanbaru, Riau 28264</p>
                                </div>
                            </div>
                            <div className={style.field2}>
                                <div className={style.garisTegak}></div>
                            </div>
                            <div className={style.field3}>
                                <div className={style.columInfo}>
                                    <p className={style.titleInfo}>Bidang Usaha</p>
                                    <p className={style.description}>FnB, fashion and craft, ternak , perkebunan dan lainnya</p>
                                </div>
                                <div className={style.columInfo}>
                                    <p className={style.titleInfo}>Website</p>
                                    <p className={style.description}>Lorem ipsum dolor sit amet consectetur</p>
                                </div>
                                <div className={style.columInfo}>
                                    <p className={style.titleInfo}>Instagram</p>
                                    <p className={style.description}>@ibnualmubarok</p>
                                </div>
                                <div className={style.columInfo}>
                                    <p className={style.titleInfo}>Whatsapp</p>
                                    <p className={style.description}>081392248571</p>
                                </div>
                            </div>
                        </div>
                        <div className={style.wrapAspek}>
                            <div className={style.columnAspek}>
                                <p className={style.titleAspek}>Aspek Produksi</p>
                                <p className={style.descriptionAspek}>Melalui kegiatan kurasi produk kreatif UMKM Barkh Sentra Usaha oleh Pesantren Al - Mubarok Pekanbaru, sehingga desain produk lebih variatif mengikuti tren yang kekinian, diminati pasar, dan bernilai jual tinggi.</p>
                                <p className={style.titleAspek}>Aspek Permodalan dan Pengelolaan Keuangan</p>
                                <p className={style.descriptionAspek}>Melalui Pencatatan Transaksi Keuangan.</p>
                            </div>
                            <div className={style.field2}>
                                <div className={style.garisTegak2}></div>
                            </div>
                            <div className={style.columnAspek}>
                                <p className={style.titleAspek}>Aspek Pemasaran</p>
                                <p className={style.descriptionAspek}>Melalui fasilitasi perluasan akses pasar seperti diluar aplikasi Whatsapp, pameran, dan branding produk ke masyakarat yang lebih luas.</p>
                                <p className={style.titleAspek}>Aspek Kewirausahaan dan Peningkatan Kapasitas</p>
                                <p className={style.descriptionAspek}>Melalui fasilitasi untuk meningkatkan kapasitas wirausaha UMKM khususnya dalam rangka akses pasar ekspor.</p>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
        <Footer/>
        
        </main>
    )
}

export default Profile;