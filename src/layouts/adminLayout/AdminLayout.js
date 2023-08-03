import Head from 'next/head';
import { Font } from '../../helper/font';
import  Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography  from '@mui/material/Typography';
import NavVertical from "../../sections/navs/NavVertical"
import { Backdrop, CircularProgress,  ThemeProvider, createTheme } from '@mui/material';
import { useState } from 'react';

const theme = createTheme({
  palette:{
    main:'#94B60F',
    success: {
      main:'#94B60F',
      contrastText: '#ffffff'
    }
  }
})

export default function AdminLayout({children, handleLoading}){

  return (
      <>
      <ThemeProvider theme={theme}>
        
        <Box sx={{display:'flex'}}>
          <NavVertical></NavVertical>
          <Box sx={{width:'100%',minHeight:'100vh', position:'sticky', top:'0rem',backgroundColor:'#f5f5f5'}}>
          <Backdrop
            sx={{ color: '#fff', zIndex: '99999' }}
            open={handleLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
            <Container className={Font.PoppinsFont.className} sx={{marginLeft:0,backgroundColor:'#f5f5f5' ,paddingTop:'1em'}}>
              {children}
            </Container>
          </Box>
        </Box>

      </ThemeProvider>
      </>
  )
}
