import dynamic from "next/dynamic"
import FlipBook from "../../components/flipbook"

import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Container, Typography } from "@mui/material";
import { poppinsFont } from "../../utils/font";

export default function detailUsaha(){
  
  
  return (
    <>
      <main className={poppinsFont.className}>
        <Header>
        </Header>
          <Container maxWidth={'md'}>   
            <Typography variant=""></Typography>
            <FlipBook></FlipBook>
          </Container>
        <Footer></Footer>
      </main>
    </>
  )  
}