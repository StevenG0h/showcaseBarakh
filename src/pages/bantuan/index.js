import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import style from "./bantuan.module.css";
import { TextField } from "@mui/material";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    })

const Bantuan = ()=> {
    return(
        <main className={poppins.className}>
            <Header/>
                <div className={style.container}>
                    <div className={style.containerBeranda}>
                        <div className={style.wrapForm}>
                            <div className={style.row1}>
                                <p className={style.title}>Hubungi Kami</p>
                                <div className={style.map}>
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18238.718508641505!2d101.4272258765038!3d0.5635607349747724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d454dd9d8c53cf%3A0xf507745c953234a!2sPondok%20Pesantren%20Ibnu%20Al%20Mubarok!5e0!3m2!1sid!2sid!4v1687922378153!5m2!1sid!2sid" style={{width : "100%", height: "100%", border: "#fff", borderRadius: '1em'}}  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                                </div>
                            </div>
                            <div className={style.row2}>
                                <div className={style.contact}>
                                    <p className={style.titleContact}>Detail Kontak</p>
                                    <hr className={style.hr}/>
                                    <div className={style.contactDetail}>
                                        <p>Jl. Sri Palas, Rumbai Bukit, Kec. Rumbai, Kota Pekanbaru, Riau 28264</p>
                                    </div>
                                    <div className={style.contactDetail}>
                                        <p>pondokpesantrenibnualmubarok@gmail.com</p>
                                    </div>
                                    <div className={style.contactDetail}>
                                        <p>+62 813 9224 8571</p>
                                    </div>
                                </div>
                                <div className={style.formInput}>
                                    <TextField id="" label="Masukkan Nama" variant="outlined" />
                                    <TextField id="" label="Masukkan Alamat" variant="outlined" />
                                    <TextField id="" label="Masukkan No. Hp" variant="outlined" />
                                    <TextField id="" label="Masukkan Email" variant="outlined" />
                                    <TextField id="" label="Masukkan Bantuan" variant="outlined" multiline rows={5} maxRows={4}/>
                                    <div className={style.Button}>
                                        <button className={style.batal}>Batal</button>
                                        <button className={style.kirim}>Kirim</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <Footer/>
        </main>
    )
}

export default Bantuan;