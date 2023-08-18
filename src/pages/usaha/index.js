import Header from "../../components/header/header";
import Footer from "../../components/footer/footer"
import style from "./usaha.module.css"
import Image from "next/image";
import imageJeruk from "../../../public/assets/images/UsahaPertanian.png";
import Link from "next/link";
import { Poppins } from 'next/font/google'
import axios from "../../utils/axios";
import WhatsApp from "../../components/Whatsapp/WhatsApp"

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
    })

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


const UnitUsaha = ({data})=> {
    let usaha = data.unitUsaha.data
    return (
        <main className={poppins.className}>
        <Header/>
            <div className={style.container}>
                <div className={style.containerUsaha}>
                    <p className={style.titleUnitUsaha} style={{gridColumn:'1/3'}}>Unit Usaha</p>
                    <div className={style.containerCard}>
                        {
                            usaha.map((data)=>{
                                return(          
                                        <Link href={'/detail-usaha/'+data.id} className={style.cardUsaha}>
                                            <img src={process.env.NEXT_PUBLIC_BACKEND_URL+"/storage/unitUsaha/"+data.usahaImage} alt="Gambar" className={style.image}/>
                                            <p className={style.titleCard}>{data.usahaName}</p>
                                            <p className={style.cardDescription}>{data.usahaDesc}</p>
                                        </Link>
                                )
                            })
                        }
                    </div>
                    
                </div>
            </div>
        <Footer/>
        <WhatsApp />
        </main>
    )
}

export default UnitUsaha;