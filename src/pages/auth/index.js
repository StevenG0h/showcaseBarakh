import { Button } from "@mui/material";
import axios from "../../utils/axios"

export default function auth(){
    
    let getCsrf = async()=>{
        let csrf = await axios.get('/sanctum/csrf-cookie').then((r)=>{
            axios.post('/api/login',{
                email:'lorem@gmail.com',
                password:'12345678'
            })
        })
        console.log(csrf);
        alert('test')
    }

    return(<>
        <p>hehe</p>
        <Button onClick={()=>{getCsrf()}}>test</Button>
    </>)
}