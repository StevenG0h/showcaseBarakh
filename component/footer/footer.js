"use client"
import style from "./footer.module.css";
import Image from 'next/image';
import ImageNavBrand from "../../public/assets/images/White.svg";
import Pertamnina from "../../public/assets/images/PERTAMINA 1.png"
import Yayasan from "../../public/assets/images/YAYSAN 1.png";
import PCR from "../../public/assets/images/my-image 1.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

const Footer = () => {
    return (
        <>
            <footer className={style.footer}>
                <div className={style.columnContainer}>
                    <div className={style.columns}>
                        <div className={style.column}>
                            <Image className={style.logoBrand} src={Pertamnina} alt='LogoAlbarakh' />
                            <Image className={style.logoBrand} src={Yayasan} alt='LogoAlbarakh' />
                            <Image className={style.logoBrand} src={PCR} alt='LogoAlbarakh' />
                        </div>
                        <div className={style.column}>
                            <div className={style.sosmed}>
                                <p>Ikuti Kami:</p>
                                <div className={style.sosmedIcon}>
                                    <Link href="" className={style.facebook_icon}><FontAwesomeIcon icon={faFacebookF} className={style.icon} /></Link>
                                    <Link href="" className={style.instagram_icon}><FontAwesomeIcon icon={faInstagram} className={style.icon} /></Link>
                                    <Link href="" className={style.youtube_icon}><FontAwesomeIcon icon={faYoutube} className={style.icon} /></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className={style.copyright}>Copyright @2023 Al-Mubarok | Politeknik Caltex Riau</p>
                </div>
            </footer>
        </>
    )
}

export default Footer;