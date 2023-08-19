"use client"
import style from "./footer.module.css";
import Image from 'next/image';
// import ImageNavBrand from "../../public/assets/images/LogoBarakhFix_1.png";
import Pertamnina from "../../../public/assets/images/PERTAMINA 1.png"
import Yayasan from "../../../public/assets/images/YAYSAN 1.png";
import PCR from "../../../public/assets/images/my-image 1.png"
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
                            <div className={style.columnLogo}>
                                {/* <p className={style.title}>Didukung Oleh</p> */}
                                <div className={style.rowsLogo}>
                                    <Image className={style.logoBrand} src={Pertamnina} alt='LogoAlbarakh' />
                                    <Image className={style.logoBrand} src={PCR} alt='LogoAlbarakh' />
                                    <Image className={style.logoBrand} src={Yayasan} alt='LogoAlbarakh' />
                                </div>
                            </div>
                        </div>
                        <div className={style.column}>
                            <div className={style.sosmed}>
                                <p className={style.title}>Ikuti Kami</p>
                                <div className={style.sosmedIcon}>
                                    <Link href="" className={style.facebook_icon}><FontAwesomeIcon icon={faFacebookF} className={style.icon} /></Link>
                                    <Link href="" className={style.instagram_icon}><FontAwesomeIcon icon={faInstagram} className={style.icon} /></Link>
                                    <Link href="" className={style.youtube_icon}><FontAwesomeIcon icon={faYoutube} className={style.icon} /></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    <div className={style.copyrightContainer}>
                        <p className={style.copyright}> © Al-Mubarok 2023 | Politeknik Caltex Riau</p>
                    </div>
            </footer>
        </>
    )
}

export default Footer;