import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import style from "./yayasan.module.css";
import Image from "next/image";
import YayasanImg from "../../../public/assets/images/YayasanImg.png" ;
import ImageTeamProfile from "../../../public/assets/images/ImageTeamProfile.png" ;
import Sugeng from "../../../public/assets/images/SugengIrianto.png";
import Julia from "../../../public/assets/images/JuliaSyafriana.png";
import Fatimah from "../../../public/assets/images/Fatimah.png";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
    weight: '500',
    subsets: ['latin']
})

const Yayasan = () => {
    return (
        <main className={poppins.className}>
            <Header />
            <div className={style.container}>
                <div className={style.containerYayasan}>
                    <div className={style.colTentangYayasan}>
                        <p className={style.title}>Tentang Yayasan</p>
                        <div className={style.colDescription}>
                            <p className={style.description}>Yayasan Pesantren Ibnu Al-Mubarok adalah sebuah lembaga pendidikan dan keagamaan Islam yang terletak di Pekanbaru, Indonesia. Pesantren ini didirikan dengan tujuan untuk menyediakan pendidikan Islam yang berkualitas serta membentuk generasi muda yang berakhlak mulia dan berpengetahuan luas.</p>
                            <p className={style.description}>Secara keseluruhan, Yayasan Pesantren Ibnu Al-Mubarok di Pekanbaru bertujuan untuk memberikan pendidikan Islam yang komprehensif, membentuk generasi muda yang berakhlak mulia, berpengetahuan luas, dan mampu mengaplikasikan nilai-nilai Islam dalam kehidupan sehari-hari.</p>
                        </div>
                    </div>
                    <div className={style.colVisiMisi}>
                        <div className={style.ImageYas}></div>
                        <Image src={YayasanImg} alt="Gambar" className={style.yayasanImage} />
                        <div className={style.colDetailVisiMisi}>
                            <div className={style.visi}>
                                <p className={style.title}>Visi Yayasan</p>
                                <p className={style.descriptionVisi}>Menjadi pusat pendidikan Islam unggul yang menghasilkan generasi muda berakhlak mulia, berpengetahuan luas, dan mampu menjadi pemimpin yang berkontribusi positif bagi masyarakat.</p>
                            </div>
                            <div className={style.misi}>
                                <p className={style.title}>Misi Yayasan</p>
                                <ol className={style.ol}>
                                    <li className={style.li}>Memberikan pendidikan agama Islam yang berkualitas tinggi melalui pengajaran Al-Qur'an, tafsir, hadis, fiqih, dan pemahaman Islam yang komprehensif.</li>
                                    <li className={style.li}>Menyelenggarakan pendidikan umum yang baik dengan mengintegrasikan mata pelajaran umum sepertiu matematika, bahasa indonesia, dan ilmu pengetahuan alam, sehingga siswa memiliki pengetahuan yang holistik.</li>
                                    <li className={style.li}>Menyelenggarakan program life skill dan leadership</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    <div className={style.colTeamYayasan}>
                        <p className={style.title}>Team Yayasan</p>
                        <div className={style.rowProfile}>
                            <div className={style.wrapProfile}>
                                <div className={style.Image}>
                                    <Image src={ImageTeamProfile} alt="Gambar" className={style.ImageTeamProfile}/>
                                </div>
                                <div className={style.identitas}>
                                    <p className={style.name}>Rinwiningsih</p>
                                    <p className={style.as}>Ketua Yayasan</p>
                                </div>
                            </div>
                            <div className={style.wrapProfile}>
                                <div className={style.Image}>
                                    <Image src={Sugeng} alt="Gambar" className={style.ImageTeamProfile}/>
                                </div>
                                <div className={style.identitas}>
                                    <p className={style.name}>Sugeng Irianto</p>
                                    <p className={style.as}>Penanggung Jawab HRD</p>
                                </div>
                            </div>
                            <div className={style.wrapProfile}>
                                <div className={style.Image}>
                                    <Image src={Fatimah} alt="Gambar" className={style.ImageTeamProfile}/>
                                </div>
                                <div className={style.identitas}>
                                    <p className={style.name}>Fatimah Ukhti Mardlotillah</p>
                                    <p className={style.as}>Personalia / HRD</p>
                                </div>
                            </div>
                            <div className={style.wrapProfile}>
                                <div className={style.Image}>
                                    <Image src={Julia} alt="Gambar" className={style.ImageTeamProfile}/>
                                </div>
                                <div className={style.identitas}>
                                    <p className={style.name}>Julia Syafriana</p>
                                    <p className={style.as}>Akunting</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}

export default Yayasan;