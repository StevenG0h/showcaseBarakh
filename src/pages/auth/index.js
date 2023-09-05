import { Alert, Box, Card, Container, FormControl, ThemeProvider, Typography, createTheme } from "@mui/material";
import axios from "../../utils/axios"
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import RHFTextFieldAuth from "../../components/form/RHFTextFieldAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { LoadingButton } from "@mui/lab";
import ImageBrand from '../../../public/assets/images/LogoBarakhFix_1.png';
import Image from "next/image";

export async function getServerSideProps({req,res}){
    let token = getCookie('token',{req,res});
    if(token != undefined){
       let isLogin =  await axios.get('/api/admin/user',{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        }).then((r)=>{
            return true
        }).catch((e)=>{
            console.log(e)
            return false
        })
        if(isLogin === true){
            return {
                redirect: {
                  permanent: false,
                  destination: "/admin/dashboard",
                },
                props:{}
              };
        }
    }
    return {
        props:{

        }
    }
    
}

export default function auth(){
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const schema = yup.object().shape({
        email: yup.string().email().required('Email tidak boleh kosong'),
        password: yup.string(),
    })
    let [error, setError] = useState('');
    const { control, handleSubmit, setValue, reset, register , formState:{errors}} = useForm({
        defaultValues: {
          email:'',
          password:'',
        },
        resolver: yupResolver(schema)
      })

    let onSubmit = async(data)=>{
            setLoading(true)
            let csrf = await axios.get('/sanctum/csrf-cookie').then(async (r)=>{
                await axios.post('/api/login',{
                    email: data.email,
                    password:data.password
                }).then((r)=>{
                    setCookie('token', r.data.plainTextToken);
                    router.push('/admin/dashboard')
                    setLoading(false)
                    
                }).catch((e)=>{
                    setLoading(false)
                    console.log(e);
                    setError('Email atau password anda salah')
                })
            })
        
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

    return(<>
    <Head>
                <link rel="icon" type="image/x-icon" href={'http://localhost:3000/assets/images/LogoSimple.png'}/>
                <title>Albarakh | Login Admin</title>
            </Head>
            <ThemeProvider theme={theme}>
    <Container>
        <Box sx={{display:'flex',justifyContent:'center', alignItems:'center', marginTop:'5em'}}>
            <Card sx={{width:'20em',padding:'1em',color:'white', backgroundColor: '#081B1C', border:'2px solid #94B60F',flexDirection:'column',gap:'1em'}}>
                <Box sx={{justifyContent:'center', display:'flex'}}>
                    <Image style={{width:'10em',height:'auto'}} src={ImageBrand} alt="BarakhLogo" />
                </Box>
                <Typography variant="h5" sx={{textAlign:'center', marginTop:'1em'}}>Login Admin</Typography>
                    <form onSubmit={handleSubmit(onSubmit,(e)=>{
                    })} style={{display:'flex',flexDirection:'column',gap:'1em'}}>
                        <FormControl>
                        {
                            error != '' ?
                            <Alert color="error">
                                {error}
                            </Alert>
                            : ''
                        }
                        </FormControl>
                        <FormControl>

                            <RHFTextFieldAuth sx={{backgroundColor:'white'}}  name={'email'} control={control} label={'Email'}></RHFTextFieldAuth>
                        </FormControl>
                        <FormControl>

                            <RHFTextFieldAuth sx={{backgroundColor:'white'}} name={'password'} control={control} label={'Password'} type="password"></RHFTextFieldAuth>
                        </FormControl>
                        <FormControl>
                            <LoadingButton loading={loading} variant="contained" type="submit" color="success">Login</LoadingButton>
                        </FormControl>
                    </form>
            </Card>
        </Box>
    </Container>
    </ThemeProvider>
    </>)
}