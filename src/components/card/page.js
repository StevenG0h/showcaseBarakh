import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./card.module.css"
import People from "@mui/icons-material/People";

const CardTestimoni = ({row}) => {
    return(
        <div className={style.container}>
            <div className={style.fieldCommand}>
                    <div className={style.picktwo}>❝</div>
                    <div className={style.text}>{row.testimonyDesc}</div>    
            </div>
            <div className={style.fieldProfile}>
                <div className={style.imageProfile}>
                    <People sx={{color:'white'}}></People>
                </div>
                <div className={style.identity}>    
                    <p className={style.name}>{row.clientName}</p>
                    {/* <p className={style.asname}>Alumni Kelas 1000 Santri Digital</p> */}
                </div>
            </div>
        </div>
    )
}

export default CardTestimoni;