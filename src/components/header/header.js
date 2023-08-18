import React, { useState } from "react";
import style from './header.module.css';
import Image from 'next/image';
import ImageBrand from '../../../public/assets/images/White.svg';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faCartShopping,
    faBars
} from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu'; 
import { useRouter } from "next/router";
import HeaderMobile from "./HeaderMobile/HeaderMobile";
import Badge from "@mui/material/Badge";
import { setVisitor } from "../../helper/dataOptions";
import { getCookie } from "cookies-next";

const Header = () => {
    let cart = getCookie('barakh-cart-cookie');
    cart = cart == undefined ? [] : JSON.parse(cart);
    console.log(cart);
    const [active, setActive] = useState(false);
    const router = useRouter();
    const [searchActive, setSearchActive] = useState(false);
    const [activeLink, setActiveLink] = useState('');
     const handleLinkClick = (path) => {
                setActiveLink(path);
    };
    

    // const [anchorX, setAnchorX] = useState(false);

    // const handleDrawerOpen = () => {
    //     setAnchorX(true);
    // }

    // const handleDrawerClose = () => {
    //     setAnchorX(false);
    // }

    return (
        <div className={style.header}>
            <div className={style.container}>
                <div className={style.iconBar}>
                    <HeaderMobile anchor='left' className={style.headerMobile}/>
                </div>
                <Link className={style.navbarbrand} href="/"> 
                    <Image className={style.barakhlogo} src={ImageBrand} alt="BarakhLogo" />
                </Link>
                <div className={style.navbarList}>
                    <ul className={style.ul}>
                        <li className={style.li}>
                            <Link style={{color: router.pathname === '/' ? '#94B60F' : ''}} className={style.navitem} href="../">Beranda</Link>
                        </li>
                        <li>
                            <div className={style.dropdown}>
                                <Link className={style.navitem} style={{color: router.pathname.includes('/profil') ? '#94B60F' : ''}} href="">Profil</Link>
                                <div className={style.dropdownContent}>
                                    <Link className={style.dropdownItem} href="/profil">Unit Usaha</Link>
                                    <Link className={style.dropdownItem} href="/profil/yayasan">Yayasan</Link>
                                    <Link className={style.dropdownItem} href="/profil/pesantren">Pesantren</Link>
                                    <Link className={style.dropdownItem} href="/galeri">Galeri</Link>
                                </div>
                            </div>
                        </li>
                        <li>
                            <Link className={style.navitem} style={{color: router.pathname === '/usaha' ? '#94B60F' : ''}} href="/usaha">Unit Usaha</Link>
                        </li>
                        <li>
                            <Link className={style.navitem} style={{color: router.pathname === '/katalog' ? '#94B60F' : ''}} href="/katalog">Katalog Produk</Link>
                        </li>
                        <li>
                            <Link className={style.navitem} style={{color: router.pathname === '/bantuan' ? '#94B60F' : ''}}
                                onClick={() => handleLinkClick('/bantuan')} href="/bantuan">Bantuan</Link>
                        </li>
                    </ul>
                </div>
                <div className={style.srccart}>
                    <Badge badgeContent={cart.length} sx={{
                        '& .MuiBadge-badge':{
                            backgroundColor: '#94B60F',
                            color: '#ffffff'
                        }
                    }}>
                        <Link style={{color: router.pathname === '/cart' ? '#94B60F' : ''}} href="/cart" ><FontAwesomeIcon className={style.iconJ} icon={faCartShopping} /></Link>
                    </Badge>
                </div>
                {/* <Search Visible={searchActive} closeClick={() => setSearchActive(false)} /> */}
                {/* <div className={style.searchBox}>
                    <input className={style.input} placeholder="Cari barang"></input>                   
                </div>  */}
            </div>
        </div>
    )
}

export default Header;
