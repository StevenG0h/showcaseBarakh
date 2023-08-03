import style from "./HeaderMobile.module.css"
import Link from "next/link";

const headerMobile = () => {
    return (
        <main>
            <div className={style.container}>
                <div className={style.containerNavigation}>
                    <div className={style.listItem}>
                        <Link href="">Beranda</Link>
                        <Link href="">Profil</Link>
                        <Link href="">Usaha</Link>
                        <Link href="">Katalog Produk</Link>
                        <Link href="">Bantuan</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default headerMobile;