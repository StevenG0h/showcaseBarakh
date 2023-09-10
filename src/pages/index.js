
import { Inter } from 'next/font/google'
import Header from '../components/header/header'
import Footer from '../components/footer/footer'
import { Poppins } from 'next/font/google'
import style from '../styles/Home.module.css'
import SliderImages from "../components/sliderImage/slider";
import ProductCategory from "../components/KategorProduct/kategori";
import Testimoni from "../components/Testimoni/testimonislider"
import axios from '../utils/axios'
import { Box, Button, Divider, Typography } from '@mui/material'
import WhatsApp from '../components/Whatsapp/WhatsApp'
import { setVisitor } from '../helper/dataOptions'
import { useRouter } from 'next/router'
import Head from 'next/head'

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
  let counter = await axios.get('/api/visitor/counter')
  console.log(counter)
  if(process.env.IS_DEVELOPMENT == 'true'){
    return {
      redirect: {
        permanent: false,
        destination: "/coming-soon",
      },
      props:{}
   }
  }
  setVisitor()
  return {
    props:{
      data:{
        unitUsaha: unitUsaha.data.data,
        testimoni: testimoni.data.data,
        produk: produk.data.data,
        counter: counter.data[0]
      }
    }
  }
}

export default function Home({data}) {
  let unitUsaha = data.unitUsaha.data;
  let testimoni = data.testimoni.data;
  let produk = data.produk.data;
  let counter = data.counter.total
  const router = useRouter()
  return (
    <main className={poppins.className}>
      <Header/>
      <Head>
      <title>Albarakh | Beranda</title>
      </Head>
      <div className={style.container}>
        <div className={style.hero}>
          <div className={style.content}>
            <p className={style.titleHero}>Ciptakan Produk Lokal <br /><span style={{ color: '#94B60F' }}>Ramah Lingkungan</span></p>
            <Button onClick={
              ()=>{
                router.push('/katalog')
              }
            } className={style.button} >Belanja Sekarang!</Button>
          </div>
          <div className={style.contentImage}>
            <SliderImages produk={produk} />
          </div>
        </div>
      </div>
      <Box sx={{textAlign:'center', mb:'5em', mt:'-3em'}}>
        <Divider></Divider>
        <Typography fontWeight={'bold'} variant='h3'  sx={{color:'#94B60F'}}>
          {counter}x
        </Typography>
        <Typography fontWeight={'bold'} variant='h6' color="white">
          Dilihat
        </Typography>
      </Box>
      <ProductCategory unitUsaha={unitUsaha} />
      <Testimoni testimoni={testimoni} />
      <Footer />
      <WhatsApp />
    </main>
  )
}
