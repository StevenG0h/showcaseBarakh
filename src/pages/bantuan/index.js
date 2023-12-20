import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import style from "./bantuan.module.css";
import { TextField } from "@mui/material";
import { Poppins } from 'next/font/google';
import { getAdminNumber } from "../../helper/dataOptions";
import * as yup from "yup";
import Head from "next/head";
import RHFTextField from "../../components/form/RHFTextField";
import RHFTextArea from "../../components/form/RHFTextArea";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    })

export async function getServerSideProps() { 
    let adminNum = await getAdminNumber();
    
    return {
        props:{
            adminNum:adminNum.data.adminNum
        }
    }
}

const Bantuan = ({adminNum})=> {

    const schema = yup.object().shape({
        nama: yup.string().required('Nama tidak boleh kosong'),
        alamat: yup.string(),
        nohp: yup.string().required('No.WhatsApp tidak boleh kosong').matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'No. WhatsApp Tidak Valid'),
        email: yup.string().required('Email tidak boleh kosong').email('Email tidak valid'),
        pesan: yup.string().required('Pesan tidak boleh kosong')
    })

    const {control, handleSubmit} = useForm({
    defaultValues:{
        nama:'',
        alamat:'',
        nohp:'',
        email:'',
        pesan:''
    },
    resolver: yupResolver(schema)
    });
    

    let handleSendMsg = (msg)=>{
        let sendMsg = "Halo Admin, berikut ini data kontak dan Pesan dari saya %0a" 
                    +"Nama: "+msg.nama + '%0a'
                    +'Alamat: '+msg.alamat+'%0a'
                    +'No.Hp: '+msg.nohp+"%0a"
                    +'Email: '+msg.email+"%0a"
                    +"Pesan: "+msg.pesan+"%0a"
        window.open('https://api.whatsapp.com/send/?phone='+adminNum+"&text="+sendMsg);
    }

    return(
        <main className={poppins.className}>
            <Header/>
            <Head>
                <title>Albarakh | Bantuan</title>
            </Head>
                <div className={style.container}>
                    <div className={style.containerBeranda}>
                        <div className={style.wrapForm}>
                            <div className={style.row1}>
                                <p className={style.title}>Hubungi Kami</p>
                                <div className={style.map}>
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18238.718508641505!2d101.4272258765038!3d0.5635607349747724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d454dd9d8c53cf%3A0xf507745c953234a!2sPondok%20Pesantren%20Ibnu%20Al%20Mubarok!5e0!3m2!1sid!2sid!4v1687922378153!5m2!1sid!2sid" style={{width : "100%", height: "100%", border: "#fff", borderRadius: '1em'}}  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                                </div>
                            </div>
                            <div className={style.row2}>
                                <div className={style.contact}>
                                    <p className={style.titleContact}>Detail Kontak</p>
                                    <hr className={style.hr}/>
                                    <div className={style.contactDetail}>
                                        <p><b>Alamat:</b> Jln. Sri Amanah RT 01/03 - Kal.Agrowisata - Kec. Rumbai Barat - Pekanbaru kode pos 28264</p>
                                    </div>
                                    <div className={style.contactDetail}>
                                        <p><b>Email:</b> albarakh@gmail.com</p>
                                    </div>
                                    <div className={style.contactDetail}>
                                        <p><b>Nomor Whatsapp:</b> +{adminNum}</p>
                                    </div>
                                </div>
                                <div className={style.formInput}>
                                    <form onSubmit={handleSubmit(handleSendMsg)} style={{display:'flex', flexDirection:'column', gap:'1em'}}>
                                        <RHFTextField hiddenLabel={true} id="" control={control} name={'nama'} label="Nama" variant="outlined" />
                                        <RHFTextField hiddenLabel={true} id="" control={control} name={'alamat'} label="Alamat" variant="outlined" />
                                        <RHFTextField hiddenLabel={true} id="" control={control} name={'nohp'} label="No. WhatsApp" variant="outlined" />
                                        <RHFTextField hiddenLabel={true} id="" control={control} name={'email'} label="Email" variant="outlined" />
                                        <RHFTextArea hiddenLabel={true} id="" control={control} name={'pesan'} label="Pesan" variant="outlined" />
                                        <div className={style.Button}>
                                            <button className={style.kirim}>Kirim</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <Footer/>
        </main>
    )
}

export default Bantuan;