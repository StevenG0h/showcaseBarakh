
import { Inter } from 'next/font/google'
import Header from '../components/header/header'
import Footer from '../components/footer/footer'
import { Poppins } from 'next/font/google'
import style from '../styles/Home.module.css'
import SliderImages from "../components/sliderImage/slider";
import ProductCategory from "../components/KategorProduct/kategori";
import Testimoni from "../components/Testimoni/testimonislider"
import axios from '../utils/axios'
import { Button } from '@mui/material'
import WhatsApp from '../components/Whatsapp/WhatsApp'
import { setVisitor } from '../helper/dataOptions'

const poppins = Poppins({
  weight: '500',
  subsets: ['latin'],
  // display: 'swap'
})

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps(){
  let unitUsaha = await axios.get('/api/unit-usaha');
  setVisitor()
  return {
    props:{
      data:{
        unitUsaha: unitUsaha.data.data
      }
    }
  }
}

export default function Home({data}) {
  let unitUsaha = data.unitUsaha.data;
  return (
    <main className={poppins.className}>
      <Header/>
      <div className={style.container}>
        <div className={style.hero}>
          <div className={style.content}>
            <p className={style.titleHero}>Ciptakan Produk Lokal <br /><span style={{ color: '#94B60F' }}>Ramah Lingkungan</span></p>
            <p className={style.description}>Al-Mubarok merupakan unit usaha yang dimiliki oleh pesantren Ibnu Al-Mubarkh, yang berdiri sejak 2020. Awal mula terbentuknya Unit Usaha ini adalah...</p>
            <Button sx={{width: '30%', padding: '0.8em', backgroundColor: '#94B60F', color: '#fff'}} className={style.button} >Selengkapnya</Button>
          </div>
          <div className={style.contentImage}>
            <SliderImages />
          </div>
        </div>
      </div>
      <ProductCategory unitUsaha={unitUsaha} />
      <Testimoni />
      <Footer />
      <WhatsApp />
    </main>
  )
}
