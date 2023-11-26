import Header from "../../components/header/header";
import Footer from "../../components/footer/footer"
import style from "./usaha.module.css"
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Poppins } from 'next/font/google'
import axios from "../../utils/axios";
import WhatsApp from "../../components/Whatsapp/WhatsApp"
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Divider, List, ListItem, ListItemButton, ListItemText, Typography, Button,ThemeProvider,createTheme } from "@mui/material";
import { useState } from "react";
import { useRouter } from 'next/router'
import { setCookie } from "cookies-next";
const poppins = Poppins({
  weight: '500',
  subsets: ['latin'],
  // display: 'swap'
})

export async function getServerSideProps() {
  let unitUsaha = await axios.get('/api/unit-usaha');
  let profil = await axios.get('/api/profil/' + unitUsaha.data.data.data[0].id);
  console.log(profil)
  return {
    props: {
      data: {
        unitUsaha: unitUsaha.data.data,
        profil: profil.data
      }
    }
  }
}

const UnitUsaha = ({ data }) => {
  let [selected, setSelected] = useState(data.unitUsaha.data[0].id);
  let [profil, setProfil] = useState(data.profil);
  let unitUsaha = data.unitUsaha.data;
  const router = useRouter()
  let handleChange = async (data) => {
    let unitUsaha = await axios.get('/api/profil/' + data);
    console.log(unitUsaha);
    setProfil(unitUsaha?.data)
  }

  const theme = createTheme({
    palette:{
      main:'#94B60F',
      success: {
        main:'#94B60F',
        contrastText: '#ffffff'
      }
    }
  })


  return (
    <ThemeProvider theme={theme}>
    <main className={poppins.className}>
      <Header />
      <div className={style.container}>
        <div className={style.containerUsaha}>
          <Box className={style.containerCard} sx={{
            backgroundColor: 'white', overflow: 'hidden', borderRadius: '1.5em', flexDirection: {
              xs: 'column',
              lg: 'row'
            }
          }}>
            <Accordion elevation={0} defaultExpanded sx={{
              width: {
                lg: '30%',
                xs: '100%'
              }, height: 'fit-content', border: 'none', outline: 'none'
            }}>
              <AccordionSummary sx={{
                margin: 0
              }}
                expandIcon={<ExpandMore></ExpandMore>}
              >
                <Typography variant="h5" fontWeight={600}>
                  Unit Usaha
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ paddingY: 0 }}>
                <List sx={{}}>
                  {
                    unitUsaha.map((map) => {
                      return (<>

                        <ListItem sx={{ padding: 0 }}>
                          <ListItemButton onClick={() => {
                            console.log(map)
                            handleChange(map.id)
                          }}>
                            <Box sx={{ width: '2.5em', aspectRatio: '1/1', marginRight: '0.5em', padding: 0, borderRadius: '100%', overflow: 'hidden', display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: '#ffffff' }}>
                              <img style={{ width: '90%', objectFit: 'contain' }} src={process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/unitUsaha/logo/' + map.unitUsahaLogo} />
                            </Box>
                            <ListItemText sx={{ color: selected.id === map.id ? '#94B60F' : '#333333' }}>
                              <Typography noWrap sx={{ fontWeight: selected.id === map.id ? '600' : '300' }}>
                                {map.usahaName}
                              </Typography>
                            </ListItemText>
                          </ListItemButton>
                        </ListItem>
                        <Divider orientation="inset" component={"li"} flexItem></Divider>
                      </>
                      )
                    })
                  }
                </List>
              </AccordionDetails>
            </Accordion>
            <Divider orientation="inset" sx={{
              backgroundColor: 'black', marginX: '1em', marginY: 0, display: {
                lg: 'none'
              }
            }} flexItem></Divider>
            <Divider orientation="vertical" sx={{
              marginX: '0', marginY: '1em', display: {
                lg: 'flex',
                xs: 'none'
              }
            }} flexItem></Divider>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ margin: '1em' }}>
                {
                  profil == '' ? '' : (
                    <>
                      <Box sx={{ display: 'flex', flexDirection: 'row' , alignItems: 'center', columnGap: '1em'}} >
                        <img className={style.imageLogoContent} src={process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/unitUsaha/logo/' + profil.unit_usaha.unitUsahaLogo} alt="Gambar"></img>
                        <Typography  fontWeight="600" sx={{ textAlign: 'left', fontSize:{xs: '1.05em', md:'2.2em',  lg:'2.2em' }}} >{
                          (
                            <span style={{ color: '#94B60F' }}>{profil.unit_usaha.usahaName}</span>
                          )
                        }</Typography>
                      </Box>
                      <Box sx={{ marginTop: '2em' }}>
                        <div dangerouslySetInnerHTML={{ __html: profil.profil_usaha_desc }}></div>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '1em 1em' }}>
                        <Button variant='contained' color='success' onClick={
                          ()=> {
                            setCookie('usahaCookie',{unit_usaha_id: profil.unit_usaha.id})
                            router.push('/katalog')
                          }
                        } >Lihat Produk</Button>
                      </Box>
                    </>
                  )
                }
              </Box>

            </Box>
          </Box>
        </div>
      </div>
      <Footer />
      <WhatsApp />
    </main>
    </ThemeProvider>
  )
}

export default UnitUsaha;