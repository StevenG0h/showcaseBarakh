import React, { useState } from "react";
import { useRouter } from "next/router";
import style from './header.module.css';
import Image from 'next/image';
import ImageBrand from '../../../public/assets/images/LogoBarakhFix_1.png';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Search from "../../components/search/search"
import {
    faSearch,
    faCartShopping
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {

const router = useRouter();

    const [activeLink, setActiveLink] = useState('');

    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    const [searchActive, setSearchActive] = useState(false);


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
                            <Link className={`${style.navitem} ${router.pathname === '/' ? style.active : ''}`}
                                onClick={() => handleLinkClick('/')} href="../">Beranda</Link>
                        </li>
                        <li>
                            <Link className={`${style.navitem} ${router.pathname === '/profil/yayasan' ? style.active : ''}`}
                                onClick={() => handleLinkClick('/profil/yayasan')} href="/profil/yayasan">Profil</Link>
                        </li>
                        <li>
                            <Link className={`${style.navitem} ${router.pathname === '/usaha' ? style.active : ''}`}
                                onClick={() => handleLinkClick('/usaha')} href="/usaha">Unit Usaha</Link>
                        </li>
                        <li>
                            <Link className={`${style.navitem} ${router.pathname === '/katalog' ? style.active : ''}`}
                                onClick={() => handleLinkClick('/katalog')} href="/katalog">Katalog Produk</Link>
                        </li>
                        <li>
                            <Link className={`${style.navitem} ${router.pathname === '/galeri' ? style.active : ''}`}
                                onClick={() => handleLinkClick('/galeri')} href="/galeri">Galeri</Link>
                        </li>
                        <li>
                            <Link className={`${style.navitem} ${router.pathname === '/bantuan' ? style.active : ''}`}
                                onClick={() => handleLinkClick('/bantuan')} href="/bantuan">Bantuan</Link>
                        </li>
                    </ul>
                </div>
                <div className={style.srccart}>
                    <button href="" className={style.iconL} onClick={() => setSearchActive(true)}><FontAwesomeIcon className={style.iconJ} icon={faSearch} /></button>
                    <Link href="/cart" ><FontAwesomeIcon className={style.iconJ} icon={faCartShopping} /></Link>
                </div>
                <Search Visible={searchActive} closeClick={() => setSearchActive(false)} />
                {/* <div className={style.searchBox}>
                    <input className={style.input} placeholder="Cari barang"></input>                   
                </div>  */}
            </div>
        </div>
    )
}

export default Header;
