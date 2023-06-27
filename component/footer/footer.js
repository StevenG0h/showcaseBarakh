"use client"
import style from "./footer.module.css";
import Image from 'next/image';
import ImageNavBrand from "../../public/assets/images/White.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

const Footer = ()=> {
    return (
            <>
        <footer className={style.footer}>
            <div className={style.columns}>
                <div className={style.column}>
                    <Image className={style.logoBrand} src={ImageNavBrand} alt='LogoAlbarakh' />
                </div>
                <div className={style.column}>
                    <div className={style.identitas}>
                        <p className={style.title}>Alamat</p>
                        <p className={style.titleex}>Jl. Singgalang V Perum BMP Blok K.No. 10</p>
                    </div>
                    <div className={style.identitas}>
                        <p className={style.title}>No.Telp</p>
                        <p className={style.titleex}>08127379214710</p>
                    </div>
                    <div className={style.identitas}>
                        <p className={style.title}>Email</p>
                        <p className={style.titleex}>mubarok@sch.id</p>
                    </div>
                </div>
                <div className={style.column}>
                    <div className={style.sosmed}>
                        <p>Follow Us:</p>  
                        <div className={style.sosmedIcon}>
                            <Link href="" className={style.facebook_icon}><FontAwesomeIcon icon={faFacebookF} className={style.icon}/></Link>
                            <Link href="" className={style.instagram_icon}><FontAwesomeIcon icon={faInstagram} className={style.icon}/></Link>
                            <Link href="" className={style.youtube_icon}><FontAwesomeIcon icon={faYoutube} className={style.icon}/></Link>
                        </div>                      
                    </div>
                </div>
            </div>     
        </footer>
        </>
    )
}

export default Footer;