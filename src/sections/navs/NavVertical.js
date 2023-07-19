import { Drawer, List, Box, ListItemButton, ListItemIcon,ListItemText, Collapse } from "@mui/material";
import Dashboard from "@mui/icons-material/Dashboard"; 
import Inventory from "@mui/icons-material/Inventory"; 
import Wallet from "@mui/icons-material/Wallet"; 
import Work from "@mui/icons-material/Work"; 
import People from "@mui/icons-material/People"; 
import Folder from "@mui/icons-material/Folder"; 
import ShoppingCart from "@mui/icons-material/ShoppingCart"; 
import Circle from "@mui/icons-material/Circle"; 
import Exit from "@mui/icons-material/ExitToApp"; 
import Image from "next/image";
import logo from "../../../public/assets/image/logo.png"
import { useState } from "react";
import { useRouter } from "next/router";
import {ConfirmDialog} from '../../components/dialog/ConfirmDialog';
import {getCookie, setCookie, deleteCookie} from 'cookies-next';
import axios from "../../utils/axios";

export default function NavVertical({data}){
    let router = useRouter();
    let [openList,setOpenList] = useState(false);
    let handleChangePage = (url)=>{
        router.push('http://localhost:3000'+url)
    }
    let [openLogout, setOpenLogout]= useState(false);
    let handleOpenLogout = ()=>{
        setOpenLogout(true)
    }
    let logout = async()=>{
        let token = getCookie('token');
        axios.get('/sanctum/csrf-cookie',{
            headers: { Authorization: `Bearer `+token},
            withCredentials: true
        }).then((r)=>{
            axios.get('/api/admin/logout',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then((r)=>{
                console.log(r.data)
                deleteCookie('token');
                router.reload();
            }).catch((e)=>{
                console.log(e);
            })
        }).catch((e)=>{
            console.log(e)
        })
    }
    return (
        <>
            <Drawer PaperProps={{sx:{backgroundColor:"#091B1C",color:"white",width:"250px",position:"sticky", height:'100vh'}}} open={true} variant="persistent">
                <Box sx={{display:'flex',flexDirection:"column",justifyContent:'space-between',overflowY:'hidden',height:"100%"}}>
                <List>
                    <List sx={{display:'flex',justifyContent:'center',marginBottom:'1em', marginTop:'1em'}}>
                        <Image width={200} src={logo}></Image>
                    </List>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/dashboard')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Dashboard sx={{m:'auto',color:'white'}}></Dashboard>
                        </ListItemIcon>
                        <ListItemText>
                            Dashboard
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/stok')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Inventory sx={{m:'auto',color:'white'}}></Inventory>
                        </ListItemIcon>
                        <ListItemText>
                            Stock
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/penjualan')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <ShoppingCart sx={{m:'auto',color:'white'}}></ShoppingCart>
                        </ListItemIcon>
                        <ListItemText>
                            Penjualan
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/keuangan')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Wallet sx={{m:'auto',color:'white'}}></Wallet>
                        </ListItemIcon>
                        <ListItemText>
                            Pencatatan
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/unit-usaha')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Work sx={{m:'auto',color:'white'}}></Work>
                        </ListItemIcon>
                        <ListItemText>
                            Unit Usaha
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/user')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <People sx={{m:'auto',color:'white'}}></People>
                        </ListItemIcon>
                        <ListItemText>
                            Pegawai
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{setOpenList(!openList)}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Folder sx={{m:'auto',color:'white'}}></Folder>
                        </ListItemIcon>
                        <ListItemText>
                            Konten
                        </ListItemText>
                    </ListItemButton>
                    <Collapse in={openList} timeout="auto" unmountOnExit>
                        <List disablePadding component="div">
                            <ListItemButton onClick={()=>{router.push('/admin/konten/profil')}} sx={{paddingRight:"5em",paddingLeft:'1.5em'}}>
                                <ListItemIcon>
                                    <Circle sx={{m:'auto',color:'white',fontSize:'0.4em'}}></Circle>
                                </ListItemIcon>
                                <ListItemText>
                                    Profil Usaha
                                </ListItemText>
                            </ListItemButton>
                            <ListItemButton onClick={()=>{router.push('/admin/konten/galeri')}} sx={{paddingRight:"5em",paddingLeft:'1.5em'}}>
                                <ListItemIcon>
                                    <Circle sx={{m:'auto',color:'white',fontSize:'0.4em'}}></Circle>
                                </ListItemIcon>
                                <ListItemText>
                                    Galeri
                                </ListItemText>
                            </ListItemButton>
                            <ListItemButton onClick={()=>{router.push('/admin/konten/testimoni')}} sx={{paddingRight:"5em",paddingLeft:'1.5em'}}>
                                <ListItemIcon>
                                    <Circle sx={{m:'auto',color:'white',fontSize:'0.4em'}}></Circle>
                                </ListItemIcon>
                                <ListItemText>
                                    Testimoni
                                </ListItemText>
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
                <Box sx={{height:'auto'}}>
                    <List sx={{height:'100%'}}>
                    <ListItemButton onClick={()=>{
                        handleOpenLogout()
                    }} sx={{paddingRight:"5em",marginTop:'auto',marginBottom:0,paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Exit sx={{m:'auto',color:'white'}}></Exit>
                        </ListItemIcon>
                        <ListItemText>
                            Logout
                        </ListItemText>
                    </ListItemButton>
                    </List>
                </Box>
                </Box>
            </Drawer>
            <ConfirmDialog msg={'Anda yakin ingin logout?'} onCancel={()=>{setOpenLogout(false)}} onConfirm={()=>logout()} open={openLogout}></ConfirmDialog>
        </>
    )
}