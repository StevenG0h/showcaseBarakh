import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./card.module.css"
import { faUser } from "@fortawesome/free-solid-svg-icons";

const CardTestimoni = () => {
    return(
        <div className={style.container}>
            <div className={style.fieldCommand}>
                    <div className={style.picktwo}>❝</div>
                    <div className={style.text}>Bahan yang digunakan sangat bagus untuk dijadikan sebuah totebag</div>    
            </div>
            <div className={style.fieldProfile}>
                <div className={style.imageProfile}>
                    <FontAwesomeIcon icon={faUser} color="white">
                    </FontAwesomeIcon>
                </div>
                <div className={style.identity}>
                    <p className={style.name}>Defri Arifin</p>
                    <p className={style.asname}>Alumni Kelas 1000 Santri Digital</p>
                </div>
            </div>
        </div>
    )
}

export default CardTestimoni;