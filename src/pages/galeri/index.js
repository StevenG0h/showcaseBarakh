import Header from "../../../component/header/header";
import Footer from "../../../component/footer/footer";
import style from "./galeri.module.css"
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from "@mui/material/Typography";
import { lightGreen } from "@mui/material/colors";
import { Poppins } from 'next/font/google'

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

const GaleriTestimoni = () => {
    const second = lightGreen[500];


    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <main className={poppins.className}>
        <Header/>
            <div className={style.container}>
                <div className={style.containerBase}>
                    <div className={style.textGaleri}>
                        <p className={style.title}>Galeri Kegiatan dan Acara</p>
                        <p className={style.subtitle}>Telusuri kegiatan kami dengan pesantren di Indonesia. Kami siap mendigitalisasikan pesantren di Indonesia.</p>
                    </div>
                    <div className={style.listWrap} >
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered
                                    sx={{
                                        "&:hover": { color: "#94B60F" },
                                        " .Mui-selected": {
                                            color: "#94B60F !important",
                                            }, 
                                        "& button:active": {
                                            color: "#94B60F"
                                        }
                                    }}
                                    TabIndicatorProps={{ style: { backgroundColor: "#94B60F" } }}
                                >
                                    <Tab label="Item One" {...a11yProps(0)} />
                                    <Tab label="Item Two" {...a11yProps(1)} />
                                    <Tab label="Item Three" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={value} index={0}>
                                Item Two
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                Item Two
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                Item Three
                            </TabPanel>
                        </Box>
                    </div>
                </div>
            </div>
        <Footer/>
        </main>
    )
}

export default GaleriTestimoni;

{/* <div className={style.navigation} aria-label="Tabs example" onChange={handleChange}>
                            <button className={style.navLink}  defaultValue= {0} >Semua</button>
                            <button className={style.navLink}  defaultValue={1}>Foto</button>
                            <button className={style.navLink}  defaultValue={2}>Video</button>
                        </div>
                        <div className={style.tabPanel} defaultValue={0}>Page 1</div>
                        <div className={style.tabPanel} defaultValue={1}>Page 2</div>
                        <div className={style.tabPanel} defaultValue={2}>Page 3</div> */}