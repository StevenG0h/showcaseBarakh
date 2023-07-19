
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import style from './profile.module.css';
import Image from "next/image";
import profileImg from '../../../public/assets/images/Profile.png';
import { Poppins } from 'next/font/google';
import ImageVisiMisi from "../../../public/assets/images/Imagevisimisi.png";
import Link from "next/link";
import WhatsApp from "../../components/Whatsapp/WhatsApp"
const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
})

const Profile = () => {
    return (
        <main className={poppins.className}>
            <Header />
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
                        <Image src={profileImg} alt="Gambar" className={style.profileImage} />
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
                                    <p className={style.description}>Mubarakh@gmail.com</p>
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
                                    <ul className={style.ul}>
                                        <li className={style.li}><Link href="">Rumah Jahit</Link></li>
                                        <li className={style.li}><Link href="">Pendidikan</Link></li>
                                        <li className={style.li}><Link href="">Pertanian</Link></li>
                                        <li className={style.li}><Link href="">Perternakan</Link></li>
                                        <li className={style.li}><Link href="">Perikanan</Link></li>
                                        <li className={style.li}><Link href="">Dapur UTI</Link></li>
                                        <li className={style.li}><Link href="">Bank Sampah</Link></li>
                                    </ul>
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
                    </div>
                    <div className={style.containerVisiMisi}>
                        <div className={style.fieldImage}>
                            <Image src={ImageVisiMisi} alt="Gambar" className={style.ImageVisiMisi} />
                        </div>
                        <div className={style.fieldVisiMisi}>
                            <div className={style.visi}>
                                <div className={style.titleSection}>
                                    <div className={style.titleVisiMisi}>Visi</div>
                                </div>
                                <div className={style.descriptionVisi}>
                                Menjadikan sebuah lembaga pendidikan yang menghasilkan generasi pengusaha muslim Entrepeneur.
                                </div>
                            </div>
                            <div className={style.misi}>
                                <div className={style.titleSection}>                                    
                                    <div className={style.titleVisiMisi}>Misi</div>
                                </div>
                                <div className={style.descriptionMisi}>
                                    <ol className={style.ol}>
                                        <li className={style.list}>Menghidupkan semangat Beragama 'Islam'</li>
                                        <li className={style.list}>Menciptakan UMKM bersyarikat Islam dnegan Produk yang mengikuti tren terkini</li>
                                        <li className={style.list}>Membantu pengngguran mendapatkan pekerjaan melalui banyaknya unit usaha</li>
                                    </ol>
                                </div>
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

export default Profile;