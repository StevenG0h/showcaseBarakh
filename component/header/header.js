"use client"
import React, { useState } from "react";
import style from './header.module.css';
import Image from 'next/image';
import ImageBrand from '../../public/assets/images/White.svg';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Search from "../../component/search/search"
import {
    faSearch,
    faCartShopping
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
    // if (!Visible) return null;
    const [active, setActive] = useState(false);

    const [searchActive, setSearchActive] = useState(false);

    // function seacrhActive() {
    //     setActive(!active)
    //     console.log("search activ")
    // }
    return (
        <div className={style.header}>
            <div className={style.container}>
                <div className={style.navbarbrand}>
                    <Image className={style.barakhlogo} src={ImageBrand} alt="BarakhLogo" />
                </div>
                {/* <div onClick={() => setActive(!active)}>
                    <div
                        className={active ? style.activeHamburger : style.hamburger}
                        />
                </div> */}
                <div className={style.navbarList}>
                    <ul className={style.ul}>
                        <li className={style.li}>
                            <Link className={style.navitem} href="../">Beranda</Link>
                        </li>
                        <li>
                            <Link className={style.navitem} href="/profil">Profil</Link>
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
                </div>
                <div className={style.srccart}>
                    <button href="" className={style.iconL} onClick={() => setSearchActive(true)}><FontAwesomeIcon className={style.iconJ} icon={faSearch}/></button>
                    <Link href="/cart" ><FontAwesomeIcon className={style.iconJ} icon={faCartShopping}/></Link>
                </div> 
                <Search Visible={searchActive} closeClick={() => setSearchActive(false)}/>
                {/* <div className={style.searchBox}>
                    <input className={style.input} placeholder="Cari barang"></input>                   
                </div>  */}
            </div>
        </div>
    )
}

export default Header;
