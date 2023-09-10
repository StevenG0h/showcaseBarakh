
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import style from './profile.module.css';
import Image from "next/image";
import profileImg from '../../../public/assets/images/Profile.png';
import { Poppins } from 'next/font/google';
import ImageVisiMisi from "../../../public/assets/images/Imagevisimisi.png";
import Link from "next/link";
import WhatsApp from "../../components/Whatsapp/WhatsApp"
import Head from "next/head";
const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
})

const Profile = () => {
    return (
        <main className={poppins.className}>
            <Header />
            <Head>
                <title>Albarakh | Tentang</title>
            </Head>
            <div className={style.container}>
                <div className={style.containerProfile}>
                    <div className={style.fieldSekilas}>
                        <div className={style.fieldSekilasEx}>
                            <p className={style.sekilas} >Sekilas Tentang</p>
                            <div className={style.wrapDescSekilas} >
                                <p className={style.descriptions}>
Bank Sampah Agrowisata (BSA) Ibnu Al Mubarok berdiri sejak tahun 2021 
sebagai salah satu program Yayasan yaitu Enterpreneur dan Lifeskill. 
Kemudian pada tahun yang sama di bulan Desember 2021 menjadi binaan 
PT Pertamina Hulu Rokan (PT PHR) yang berkolaborasi dengan Bank Sampah Unilak. 
Dalam pengelolaannya Bank Sampah Agrowisata Ibnu Al Mubarok melibatkan masyarakat 
sekitar dan juga yayasan Ibnu disabilitas. <br></br>
<br></br>

Dalam perkembangannya Bank Sampah Agrowisata Ibnu Al Mubarok berkembang pesat dan memiliki beberapa unit usaha yang menghasilkan produk ramah lingkungan untuk mendukung kelestarian lingkungan.
<br></br>
<br></br>
Unit Usaha yang dikelola oleh Bank Sampah Agrowisata Ibnu Al-Mubarok antara lain membuka  Diklat Kewirausahaan , budidaya maggot, ternak ayam kampung ,pupuk kompos, kasgot, pupuk cair Lindi , lele bioflok . Selain itu unit usaha yang terbaru pengembangan dari unit usaha BSA adalah  Produksi Briket Arang, Produksi Sabun Ramah Lingkungan di bawah Binaan PT PHR dan Politeknik Caltex Riau.  Fashion & Craft menjadi salah satu produk UMKM yang saat ini mulai berkembang. Produk unit usaha BSA diberi merek "Barakh" yang artinya Anugerah.
<br></br>
<br></br>

Dari semua kegiatan tersebut sudah terjadi sirkulasi aktivitas ekonomi dari pengelolaan sampah.

</p>
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
                        {/* <Image src={profileImg} alt="Gambar" className={style.profileImage} /> */}
                        <div className={style.wrapInformation}>
                            <div className={style.field1}>
                                <div className={style.columInfo}>
                                    <p className={style.titleInfo}>Nama UMKM</p>
                                    <p className={style.description}>Bank Sampah Agrowisata Ibnu Al-Mubarok</p>
                                </div>
                                <div className={style.columInfo}>
                                    <p className={style.titleInfo}>Tahun Pendirian</p>
                                    <p className={style.description}>Sejak 2022</p>
                                </div>
                                <div className={style.columInfo}>
                                    <p className={style.titleInfo}>Email</p>
                                    <p className={style.description}>albarakhpku@gmail.com</p>
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
                                        <li className={style.li}><Link href="" className={style.listUnitUsaha}>Bank Sampah Agrowisata Ibnu Al-Mubarok</Link></li>
                                        <li className={style.li}><Link href="" className={style.listUnitUsaha}>Perternakan & Perikanan</Link></li>
                                        <li className={style.li}><Link href="" className={style.listUnitUsaha}>Pertanian</Link></li>
                                        <li className={style.li}><Link href="" className={style.listUnitUsaha}>Briket Arang</Link></li>
                                        <li className={style.li}><Link href="" className={style.listUnitUsaha}>Clean & Wash</Link></li>
                                        <li className={style.li}><Link href="" className={style.listUnitUsaha}>Fashion & Craft</Link></li>
                                        <li className={style.li}><Link href="" className={style.listUnitUsaha}>Kuliner</Link></li>
                                        <li className={style.li}><Link href="" className={style.listUnitUsaha}>Lembaga Pelatihan dan Konsultasi</Link></li>
                                    </ul>
                                </div>
                                <div className={style.columInfo}>
                                    <p className={style.titleInfo}>Instagram</p>
                                    <p className={style.description}>@bsa_al_mubarok</p>
                                </div>
                                <div className={style.columInfo}>
                                    <p className={style.titleInfo}>Whatsapp</p>
                                    <p className={style.description}>081392248571</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className={style.containerVisiMisi}>
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
                                        <li className={style.list}>Menciptakan UMKM bersyarikat Islam dengan Produk yang mengikuti tren terkini</li>
                                        <li className={style.list}>Membantu pengngguran mendapatkan pekerjaan melalui banyaknya unit usaha</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>                 */}
                </div>
            </div>
            <Footer />
            <WhatsApp />
        </main>
    )
}

export default Profile;