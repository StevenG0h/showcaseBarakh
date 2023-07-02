import style from "./cart.module.css"
import { useState } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import imageCart from "../../../public/assets/images/cart.png";
import NoticeModal from "../../components/NoticeModal/notice_modal"
import Image from "next/image";
import Link from "next/link";
import { Poppins } from 'next/font/google'

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
})


const Cart = () => {
    const [showNotice, setShowNotice] = useState(false);

    return (
        <main className={poppins.className}>
            <Header />
            <div className={style.container}>
                <div className={style.containerCart}>
                    <p className={style.title}>Keranjang</p>
                    <div className={style.topCart}>
                        <div className={style.pilih}>
                            <input className={style.input} type="checkbox" />
                            <p className={style.textPilih}>Pilih Semua</p>
                        </div>
                        <button className={style.buttonHapus}>Hapus</button>
                    </div>
                    <hr className={style.garis} />
                    <div className={style.mainCart}>
                        <div className={style.fieldList}>
                            <div className={style.fieldListProduct}>
                                <input className={style.inputt} type="checkbox" />
                                <div className={style.list}>
                                    <div className={style.image}>
                                        <Image src={imageCart} alt="Gambar" className={style.imageCart} />
                                    </div>
                                    <div className={style.detailProductCart}>
                                        <Link href="/detailProduct" className={style.link}>
                                            <p className={style.titleProduct}>Goodie Bag Rajut</p>
                                        </Link>
                                        <div className={style.remaining}>
                                            <p className={style.remainingCheck}>sisa 5</p>
                                            <p className={style.price}>Rp.80.000,00-.</p>
                                        </div>
                                        <div className={style.detailSetProduct}>
                                            <button className={style.hapus}></button>
                                            <div className={style.setAmount}>
                                                <button className={style.kurang}>-</button>
                                                <p className={style.amount}>1</p>
                                                <button className={style.tambah}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style.ringkasanBelanja}>
                            <div className={style.descRingkasan}>
                                <p className={style.titleRingkasan}>Ringkasan Belanja</p>
                                <div className={style.detailPrice}>
                                    <div className={style.textTotal}>Total Belanja Anda : </div>
                                    <div className={style.total}>Rp.180.000,00-.</div>
                                </div>
                            </div>
                            <button className={style.buttonBuy} onClick={() => setShowNotice(true)}>Lanjutkan Pembayaran</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <NoticeModal isVisible={showNotice} CloseClick={() => setShowNotice(false)}/>
        </main>
    )
}

export default Cart;