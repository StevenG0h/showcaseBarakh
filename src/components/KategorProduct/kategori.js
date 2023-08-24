import style from './kategori.module.css';
import Image from 'next/image';
import Masjid from '../../../public/assets/images/MasjidAlBarakh.png';
import Link from 'next/link';

const ProductCategory = ({unitUsaha}) => {
    return (
        <div className={style.container}>
        <div className={style.containerCategory}>
            <div className={style.textCategory}>
                <p className={style.titleCategory}>Unit Usaha</p>
                <p className={style.descriptionTitle}> Al - Mubarakh memiliki beberapa unit usaha unggulan dan menciptakan produk-produk ramah lingkungan</p>
            </div>
            <div className={style.containerKatalog}>
                {
                    unitUsaha.map((data)=>{
                        return (
                <Link href="usaha" className={style.link}>
                    <div className={style.katalogWrapper}>
                        <img className={style.imageKatalog} src={process.env.NEXT_PUBLIC_BACKEND_URL+"/storage/unitUsaha/"+data.usahaImage} alt='Gambar' />
                        <p className={style.titleKatalog}>{data.usahaName}</p>
                        <p className={style.descriptionKatalog}>{data.usahaDesc}</p>
                    </div>
                </Link>
                    )    
                    })
                }
            </div>
        </div>
        </div>
    )

}

export default ProductCategory;
