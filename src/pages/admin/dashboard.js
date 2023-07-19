import { Card, Container, Grid, Typography } from "@mui/material";
import CustomBarChart from "../../components/chart/CustomBarChart";
import AdminLayout from "../../layouts/adminLayout/AdminLayout";
import CustomLineChart from "../../components/chart/CustomLineChart";
import CustomDoughnutChart from "../../components/chart/CustomDoughnutChart";
import {getCookie} from 'cookies-next';
import axios from "../../utils/axios";

export async function getServerSideProps({req,res}){
    let token = getCookie('token',{req,res});
    if(token == undefined){
        return {
            redirect: {
              permanent: false,
              destination: "/auth",
            },
            props:{},
          };
    }
    await axios.get('/user',{
        headers:{
            Authorization: 'Bearer '+token,
        },
        withCredentials:true
    }).catch((e)=>{
        return {
            redirect: {
              permanent: false,
              destination: "/auth",
            },
            props:{},
          };
    })
    return {
        props:{
            data:[]
        }
    }
}

export default function Dashboard(){
    return (
        <>
            <AdminLayout>
                <Container>
                    <Typography variant={'h3'}>
                        Dashboard
                    </Typography>
                    <Grid container sx={{margin:'-1em'}}>

                        <Grid item xs={'12'}>
                            <Card sx={{height:'50vh',padding:'1em', margin:'1em'}}>
                                <CustomBarChart color={['#049ffb','#58B63B']}></CustomBarChart>
                            </Card>
                        </Grid>  

                        <Grid item xs={'6'}>
                            <Card sx={{height:'50vh',padding:'1em', margin:'1em'}}>
                                <CustomLineChart></CustomLineChart>
                            </Card>
                        </Grid>  
                        
                        <Grid item xs={'6'}>
                            <Card sx={{height:'50vh',padding:'1em', margin:'1em'}}>
                                <CustomDoughnutChart></CustomDoughnutChart>
                            </Card>
                        </Grid>  
                    </Grid>
                    
                    
                </Container>
            </AdminLayout>
        </>
    )
}