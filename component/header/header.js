"use client"
import React, { useState } from "react";
import style from './header.module.css';
import Image from 'next/image';
import ImageBrand from '../../public/assets/images/Brand.png';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faCartShopping
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
    const [active, setActive] = useState(false);
    return (
        <div className={style.header}>
            <div className={style.container}>
                <div className={style.navbarbrand}>
                    <Image className={style.barakhlogo} src={ImageBrand} alt="BarakhLogo" />
                </div>
                <div onClick={() => setActive(!active)}>
                    <div
                        className={active ? style.activeHamburger : style.hamburger}
                    />
                </div>
                {/* <div className={style.navbarList}>
                    <ul className={style.ul}>
                        <li className={style.li}>
                            <Link className={style.navitem} href="../">Beranda</Link>
                        </li>
                        <li>
                            <Link className={style.navitem} href="/visimisi">Profil</Link>
                        </li>
                        <li>
                            <Link className={style.navitem} href="/usaha">Unit Usaha</Link>
                        </li>
                        <li>
                            <Link className={style.navitem} href="/katalog">Katalog Produk</Link>
                        </li>
                        <li>
                            <Link className={style.navitem} href="/galeri">Galeri</Link>
                        </li>
                        <li>
                            <Link className={style.navitem} href="/bantuan">Bantuan</Link>
                        </li>
                    </ul>
                </div>*/}
                <div className={style.srccart}>
                    <a href="" className={style.iconL}><FontAwesomeIcon className={style.iconJ} icon={faSearch} style={{ color: '#fff' }} /></a>
                    <Link href="/cart" className={style.iconL}><FontAwesomeIcon className={style.iconJ} icon={faCartShopping} style={{ color: '#fff' }} /></Link>
                </div> 
            </div>
        </div>
    )
}

export default Header;
