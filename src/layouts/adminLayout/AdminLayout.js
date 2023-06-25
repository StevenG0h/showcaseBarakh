import Head from 'next/head';
import { Font } from '@/helper/font';
import  Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography  from '@mui/material/Typography';
import NavVertical from "../../sections/navs/NavVertical"


export default function AdminLayout({children}){
  return (
      <>
        <Box sx={{display:'flex'}}>
          <NavVertical></NavVertical>
          <Container className={Font.PoppinsFont.className} sx={{backgroundColor:'#f5f5f5' ,paddingTop:'1em'}}>
            {children}
          </Container>
        </Box>
      </>
  )
}
