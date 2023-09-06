import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import style from "./galeri.module.css";
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from "@mui/material/Typography";
import { lightGreen } from "@mui/material/colors";
import { Poppins } from 'next/font/google';
import ImageGaleri from "../../components/ImageGaleri/image";
import GaleriCard from "../../components/card/GaleriCard/GaleriCard";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import WhatsApp from "../../components/Whatsapp/WhatsApp"
import axios from "../../utils/axios";
import { Button } from "@mui/material";
import  ChevronRight  from "@mui/icons-material/ChevronRight";
import  ChevronLeft  from "@mui/icons-material/ChevronLeft";
import Head from "next/head";
const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
})




function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


// const useStyles = makeStyles(theme => ({
//     tab: { 
//         '& .MuiBox-root': {
//           padding: '0px',
//           },
//         },
//     }));

export async function getServerSideProps(serverSide) {
    let galeri = await axios.get('/api/galeri');
    return {
        props:{
            galeri: galeri.data.data
        }
    }
}

const GaleriTestimoni = ({galeri}) => {
    let [galeriData, setGaleri] = useState(galeri.data)
    let [galeriLink, setGaleriLink] = useState(galeri.links)
    const second = lightGreen[500];

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let handleChangePage = async (link)=>{
        if(link != null){
            let unitUsaha = await axios.get(link,{
                headers:{
                    Authorization: 'Bearer '+token,
                },
                withCredentials:true
            });
            setGaleri(unitUsaha?.data?.data?.data)
            setGaleriLink(unitUsaha?.data?.data?.links)
        }
    }

    return (
        <main className={poppins.className}>
            <Header />
            <Head>
                <title>Albarakh | Galeri</title>
            </Head>
            <div className={style.container}>
                <div className={style.containerBase}>
                    <div className={style.textGaleri}>
                        <p className={style.title}>Galeri Kegiatan dan Acara</p>
                        {/* <p className={style.description}>Telusuri kegiatan kami dengan pesantren di Indonesia. Kami siap mendigitalisasikan pesantren di Indonesia.</p> */}
                    </div>
                    <div className={style.listWrap} >
                        <Box sx={{ width: '100%' }}>
                            <div className={style.boxGaleri}>
                                {
                                    galeriData.map((data)=>{
                                        return <GaleriCard data={data}/>
                                    })
                                }
                            </div>       
                            
                        </Box>
                        <Box sx={{display:'flex', flexDirection:'row', justifyContent:'center', marginTop:'1em'}}>
                    {
                        galeriLink.map((link)=>{
                            return (
                                <Button fullWidth size="sm" sx={{margin:'0.5em',paddingY:'1em', paddingX:'0', width:0, height:0}} key={link.label} variant={link.active ? 'contained' : 'outlined'} color={'success'} onClick={()=> handleChangePage(link.url)}>{
                                    link.label == '&laquo; Previous'? <ChevronLeft ></ChevronLeft> : link.label == 'Next &raquo;' ? <ChevronRight></ChevronRight> : link.label
                                }</Button>
                            )
                        })
                    }
                    </Box>
                    </div>
                </div>
            </div>
            <Footer />
            <WhatsApp />
        </main>
    )
}

export default GaleriTestimoni;


