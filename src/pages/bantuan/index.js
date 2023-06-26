import Header from "../../../component/header/header";
import Footer from "../../../component/footer/footer";
import style from "./bantuan.module.css"
import { Poppins } from 'next/font/google'

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
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
                                <div className={style.map}></div>
                            </div>
                            <div className={style.row2}>
                                <div className={style.contact}>
                                    <p className={style.titleContact}>Contantct Detail</p>
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
                                    <input type="text" placeholder="Masukkan Nama" className={style.input}/>
                                    <input type="text" placeholder="Masukkan Alamat" className={style.input}/>
                                    <input type="text" placeholder="Masukkan No. Hp" className={style.input}/>
                                    <input type="text" placeholder="Masukan Email" className={style.input}/>
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