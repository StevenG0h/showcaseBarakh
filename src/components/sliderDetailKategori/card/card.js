import Image from "next/image";
import style from "./card.module.css";
import imageDetail from "../../../../public/assets/images/imageDetailUsaha.png"


const Card = () => {
    return (
        <div className={style.containerCard}>
            <Image src={imageDetail} alt="Gambar" className={style.image}/>
            <div className={style.fieldDetail}>
                <p className={style.titleDetail}>Goodiebag</p>
                <p className={style.description}>100% Hasil penggunaan daur ulang dan produk natural</p>
                <div className={style.directiveCard}>
                    <p className={style.price}>Rp 40. 000</p>
                    <button className={style.masukKeranjang}>Masuk Ke Keranjang</button>
                </div>
            </div>
        </div>
    )
}

export default Card;