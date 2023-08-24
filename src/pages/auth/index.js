import { Alert, Box, Button, Card, Container, FormControl, Typography } from "@mui/material";
import axios from "../../utils/axios"
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import RHFTextField from "../../components/form/RHFTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";

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
                props:{},
              };
        }
    }
    return {
        props:{
            data:[]
        }
    }
    
}

export default function auth(){
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
            let csrf = await axios.get('/sanctum/csrf-cookie').then(async (r)=>{
                await axios.post('/api/login',{
                    email: data.email,
                    password:data.password
                }).then((r)=>{
                    setCookie('token', r.data.plainTextToken);
                    router.push('/admin/dashboard')
                }).catch((e)=>{
                    console.log(e);
                    setError('Email atau password anda salah')
                })
            })
        
    }

    return(<>
    <Container>
        <Box sx={{display:'flex',justifyContent:'center', alignItems:'center', marginTop:'5em'}}>
            <Card sx={{padding:'1em',flexDirection:'column',gap:'1em'}}>
                <Typography variant="h5">Login</Typography>
                    <form onSubmit={handleSubmit(onSubmit,(e)=>{
                        console.log(e)
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

                            <RHFTextField name={'email'} control={control} label={'Email'}></RHFTextField>
                        </FormControl>
                        <FormControl>

                            <RHFTextField name={'password'} control={control} label={'Password'} type="password"></RHFTextField>
                        </FormControl>
                        <FormControl>

                        <Button variant="contained" color="success" type='submit'>Login</Button>
                        </FormControl>
                    </form>
            </Card>
        </Box>
    </Container>
    </>)
}