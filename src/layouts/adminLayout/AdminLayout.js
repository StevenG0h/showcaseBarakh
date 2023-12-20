import Head from 'next/head';
import { Font } from '../../helper/font';
import  Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography  from '@mui/material/Typography';
import NavVertical from "../../sections/navs/NavVertical"
import { Backdrop, Button, CircularProgress,  IconButton,    ThemeProvider, createTheme } from '@mui/material';
import { useState } from 'react';
import Menu from '@mui/icons-material/Menu';

const theme = createTheme({
  palette:{
    main:'#94B60F',
    success: {
      main:'#94B60F',
      contrastText: '#ffffff'
    }
  }
})

export default function AdminLayout({children, handleLoading, admin, isSuper}){
  let [openMobile, setMobile] = useState(false)

  return (
      <>
      <ThemeProvider theme={theme}>
        <Head>
          Albarakh | Admin
        </Head>
        <Box sx={{display:'flex'}}>
          <NavVertical isSuper={isSuper} handleOpenMobile={()=>setMobile(!openMobile)} open={openMobile} admin={admin}></NavVertical>
          <Box sx={{width:'100%',minHeight:'100vh', position:'sticky', top:'0rem',backgroundColor:'#f5f5f5'}}>
          <Backdrop
            sx={{ color: '#fff', zIndex: '99999' }}
            open={handleLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
            <Container className={Font.PoppinsFont.className} sx={{marginX:'auto',backgroundColor:'#f5f5f5' ,paddingTop:'1em'}}>
              <IconButton sx={{display:{
                md:'none'
              }}} size='large'  onClick={()=>setMobile(!openMobile)}>
                <Menu fontSize='inherit'></Menu>
              </IconButton>
              {children}
            </Container>
          </Box>
        </Box>

      </ThemeProvider>
      </>
  )
}
