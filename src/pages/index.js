
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
import Link from 'next/link'
import { useRouter } from 'next/router'

const poppins = Poppins({
  weight: '500',
  subsets: ['latin'],
  // display: 'swap'
})

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps(){
  let unitUsaha = await axios.get('/api/unit-usaha');
  let testimoni = await axios.get('/api/testimoni');
  let produk = await axios.get('/api/produk/home');
  setVisitor()
  return {
    props:{
      data:{
        unitUsaha: unitUsaha.data.data,
        testimoni: testimoni.data.data,
        produk: produk.data.data
      }
    }
  }
}

export default function Home({data}) {
  let unitUsaha = data.unitUsaha.data;
  let testimoni = data.testimoni.data;
  let produk = data.produk.data;
  const router = useRouter()
  return (
    <main className={poppins.className}>
      <Header/>
      <div className={style.container}>
        <div className={style.hero}>
          <div className={style.content}>
            <p className={style.titleHero}>Ciptakan Produk Lokal <br /><span style={{ color: '#94B60F' }}>Ramah Lingkungan</span></p>
            <Button onClick={
              ()=>{
                router.push('/katalog')
              }
            } sx={{width: 'fit-content', padding: '0.8em', marginTop:'5em',marginLeft:'auto',marginRight:'0', backgroundColor: '#94B60F', color: '#fff'}} className={style.button} >Belanja Sekarang!</Button>
          </div>
          <div className={style.contentImage}>
            <SliderImages produk={produk} />
          </div>
        </div>
      </div>
      <ProductCategory unitUsaha={unitUsaha} />
      <Testimoni testimoni={testimoni} />
      <Footer />
      <WhatsApp />
    </main>
  )
}
