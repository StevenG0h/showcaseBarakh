import dynamic from "next/dynamic"
import FlipBook from "../../components/flipbook"

import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Container, ImageList, ImageListItem, ImageListItemBar, Typography } from "@mui/material";
import { poppinsFont } from "../../utils/font";
import axios from "../../utils/axios";
import  ChevronRight  from "@mui/icons-material/ChevronRight";
import  ChevronLeft  from "@mui/icons-material/ChevronLeft";

export async function getServerSideProps({req,res,query}){
  console.log(query);
  let unitUsaha = await axios.get('/api/profil/'+query.unit_usaha_id).catch((e)=>{
    console.log(e);
  });
  console.log(unitUsaha)
  return {
    props:{
      data:unitUsaha.data
    }
  }
}

export default function detailUsaha({data}){
  
  return (
    <>
      <main className={poppinsFont.className} style={{backgroundColor:'white'}}>
        <Header>
        </Header>
          <Container maxWidth={'md'} sx={{paddingY:'5em'}}>   
            <Typography variant="h4" fontWeight="600" sx={{textAlign:'left',marginBottom:'1em'}}>Unit Usaha: {
              (
                <span style={{color:'#94B60F'}}>{data.unit_usaha.usahaName}</span>
              )
            }</Typography>
            
            <FlipBook>
              {
                data.profil_usaha_images.map((image)=>{
                  return (<img src={process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/profil/'+image.path}></img>)
                })
              }
            </FlipBook>

            <Typography sx={{marginY:'1em'}} >
              
                {data.profil_usaha_desc}
              
            </Typography>

              {
                data.unit_usaha.products.map((product,index)=>{
                  console.log(product)
                  return (
                    <>
                    <Typography sx={{marginY:'1em'}} fontWeight="600">
            
                    {++index}.{product.productName}
            
                    </Typography>
                    <img style={{width:'100%', aspectRatio:'16/9', objectFit:'cover', borderRadius:'1em'}} src={process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/product/'+product.product_images[0].path}></img>
                    </>

                  )
                })
              }
            {/* <ImageList variant="masonry" cols={3} gap={8}>
              {
                data.unit_usaha.products.map((product)=>{
                  console.log(product)
                  return (
                    <ImageListItem>
                      <img src={process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/product/'+product.product_images[0].path}></img>
                      <ImageListItemBar title={product.productName}>
                      </ImageListItemBar>
                    </ImageListItem>
                  )
                })
              }
            </ImageList> */}
          </Container>
        <Footer></Footer>
      </main>
    </>
  )  
}