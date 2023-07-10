
import { Inter } from 'next/font/google'
import Header from '../components/header/header'
import Footer from '../components/footer/footer'
import { Poppins } from 'next/font/google'
import style from '../styles/Home.module.css'
import SliderImages from "../components/sliderImage/slider";
import ProductCategory from "../components/KategorProduct/kategori";
import Testimoni from "../components/Testimoni/testimonislider"
import axios from '../utils/axios'


const poppins = Poppins({
  weight: '500',
  subsets: ['latin'],
  // display: 'swap'
})

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps(){
  let unitUsaha = await axios.get('/api/unit-usaha');
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
            <p className={style.description}>Ibnu Al-Mubarok menciptakan produk usaha yang bergerak dalam bidang kewirausahaan untuk menciptakan pondok pesantren yang mandiri (Single fighter) ....</p>
            <button className={style.button} type="button" >Selengkapnya</button>
          </div>
          <div className={style.contentImage}>
            <SliderImages />
          </div>
        </div>
      </div>
      <ProductCategory unitUsaha={unitUsaha} />
      <Testimoni />
      <Footer />
    </main>
  )
}
