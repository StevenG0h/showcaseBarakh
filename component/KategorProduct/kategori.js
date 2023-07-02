import style from './kategori.module.css';
import Image from 'next/image';
import Masjid from '../../public/assets/images/MasjidAlBarakh.png';
import Link from 'next/link';

const ProductCategory = () => {
    return (
        <div className={style.container}>
        <div className={style.containerCategory}>
            <div className={style.textCategory}>
                <p className={style.titleCategory}>Unit Usaha</p>
                <p className={style.descriptionTitle}>Pesantren tersebut memiliki beberapa badan usaha, dari bidang FnB sampai ke bidang fashion and craft</p>
            </div>
            <div className={style.containerKatalog}>
                <Link href="/detailKategori" className={style.link}>
                    <div className={style.katalogWrapper}>
                        <Image className={style.imageKatalog} src={Masjid} alt='Gambar' />
                        <p className={style.titleKatalog}>Pendidikan</p>
                        <p className={style.descriptionKatalog}>Unit usaha yang bergerak dalam bidang pendidikan seperti MA MI MTS, WISATA EDUKASI, Bumi Perkemahan dan pondok pesantren</p>
                    </div>
                </Link>
                <Link href="/detailKategori" className={style.link}>
                    <div className={style.katalogWrapper}>
                        <Image className={style.imageKatalog} src={Masjid} alt='Gambar' />
                        <p className={style.titleKatalog}>Pendidikan</p>
                        <p className={style.descriptionKatalog}>Unit usaha yang bergerak dalam bidang pendidikan seperti MA MI MTS, WISATA EDUKASI, Bumi Perkemahan dan pondok pesantren</p>
                    </div>
                </Link>
                <Link href="/detailKategori" className={style.link}>
                    <div className={style.katalogWrapper}>
                        <Image className={style.imageKatalog} src={Masjid} alt='Gambar' />
                        <p className={style.titleKatalog}>Pendidikan</p>
                        <p className={style.descriptionKatalog}>Unit usaha yang bergerak dalam bidang pendidikan seperti MA MI MTS, WISATA EDUKASI, Bumi Perkemahan dan pondok pesantren</p>
                    </div>
                </Link>
                <Link href="/detailKategori" className={style.link}>
                    <div className={style.katalogWrapper}>
                        <Image className={style.imageKatalog} src={Masjid} alt='Gambar' />
                        <p className={style.titleKatalog}>Pendidikan</p>
                        <p className={style.descriptionKatalog}>Unit usaha yang bergerak dalam bidang pendidikan seperti MA MI MTS, WISATA EDUKASI, Bumi Perkemahan dan pondok pesantren</p>
                    </div>
                </Link>
                <Link href="/detailKategori" className={style.link}>
                    <div className={style.katalogWrapper}>
                        <Image className={style.imageKatalog} src={Masjid} alt='Gambar' />
                        <p className={style.titleKatalog}>Pendidikan</p>
                        <p className={style.descriptionKatalog}>Unit usaha yang bergerak dalam bidang pendidikan seperti MA MI MTS, WISATA EDUKASI, Bumi Perkemahan dan pondok pesantren</p>
                    </div>
                </Link>
                <Link href="/detailKategori" className={style.link}>
                    <div className={style.katalogWrapper}>
                        <Image className={style.imageKatalog} src={Masjid} alt='Gambar' />
                        <p className={style.titleKatalog}>Pendidikan</p>
                        <p className={style.descriptionKatalog}>Unit usaha yang bergerak dalam bidang pendidikan seperti MA MI MTS, WISATA EDUKASI, Bumi Perkemahan dan pondok pesantren</p>
                    </div>
                </Link>
            </div>
        </div>
        </div>
    )

}

export default ProductCategory;
