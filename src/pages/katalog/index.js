import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import KatalogCard from "../../components/card/KatalogCard/KatalogCard";
import style from "./katalog.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import Keripik from "../../../public/assets/images/Keripik.png";
import Image from "next/image";
import { Poppins } from 'next/font/google'
import axios from "../../utils/axios";
import { Grid } from "@mui/material";
import WhatsApp from "../../components/Whatsapp/WhatsApp"

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
  })

export async function getServerSideProps({context}){
    let produk = await axios.get('/api/produk');
    console.log(produk.data);
    return {
        props:{
            products:produk.data.data
        }
    }
}

const Katalog = ({products}) => {
    return (
        <main className={poppins.className}>
        <Header/>
            <div className={style.container}>
                <div className={style.containerBase}>
                    <div className={style.banner}>
                    </div>
                    <div className={style.containerKatalog}>
                        <ul className={style.ul}>
                            <li className={style.li}><a className={style.a} href="">Semuanya</a></li>
                            <li className={style.li}><a className={style.a} href="">Galeri Oleh-Oleh</a></li>
                            <li className={style.li}><a className={style.a} href="">Rumah Jahit</a></li>
                            <li className={style.li}><a className={style.a} href="">Pertanian</a></li>
                            <li className={style.li}><a className={style.a} href="">Perternakan</a></li>
                        </ul>
                    </div>
                    <Grid container gap={'1em'}>
                        {
                            products.map((product)=>{
                                return (
                                    <Grid item xs={3} key={product.id}>
                                        <KatalogCard style={style} row={product}></KatalogCard>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </div>
            </div>
        <Footer/>
        <WhatsApp/>
        </main>
    )
}

export default Katalog;