import style from "./card.module.css"
import { Avatar } from "@mui/material";
import Image from "next/image";
import FaturImg from "../../../public/assets/images/Atong.png";

const data  = [
    {
        image: "../../../public/assets/images/Fatur.png",
        name: "Fatur",
        asname: "Mahasiswa PCR"
    },
    {
        image: "../../../public/assets/images/Fatur.png",
        name: "Fatur",
        asname: "Mahasiswa PCR",
        text: "Bahan yang digunakan sangat bagus untuk dijadikan sebuah totebag"
    }
]

const CardTestimoni = () => {
    return(
        <div className={style.container}>
            <div className={style.fieldCommand}>
                    <div className={style.picktwo}>❝</div>
                    <div className={style.text}>Bahan yang digunakan sangat bagus untuk dijadikan sebuah totebag</div>    
            </div>
            <div className={style.fieldProfile}>
                <Avatar src="../../../public/assets/images/Atong.png" alt="Gambar" className={style.imageProfile}/>
                {/* <div className={style.imageProfile}>-</div> */}
                <div className={style.identity}>
                    <p className={style.name}>Defri Arifin</p>
                    <p className={style.asname}>Alumni Kelas 1000 Santri Digital</p>
                </div>
            </div>
        </div>
    )
}

export default CardTestimoni;