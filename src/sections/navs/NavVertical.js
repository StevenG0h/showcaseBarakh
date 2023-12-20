import { Drawer, List, Box, ListItemButton, ListItemIcon,ListItemText, Collapse, Typography } from "@mui/material";
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
import logo from "../../../public/assets/images/Group 5.png"
import { useState } from "react";
import { useRouter } from "next/router";
import {ConfirmDialog} from '../../components/dialog/ConfirmDialog';
import {getCookie, deleteCookie} from 'cookies-next';
import axios from "../../utils/axios";
import  Paid  from "@mui/icons-material/Paid";
import  Dataset  from "@mui/icons-material/Dataset";
import Head from "next/head";

export default function NavVertical({isSuper, admin, open, handleOpenMobile}){
    let router = useRouter();
    let [openList,setOpenList] = useState(false);
    let [openList2,setOpenList2] = useState(false);
    let handleChangePage = (url)=>{
        router.replace('https://albarakh.com'+url)
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
            <Head>
                <link rel="icon" type="image/x-icon" href={'http://localhost:3000/assets/images/LogoSimple.png'}/>
            </Head>
            <Drawer  PaperProps={{sx:{backgroundColor:"#091B1C",color:"white",width:"250px", display:{
                md:'block',
                xs:'none'
            },position:"sticky", height:'100vh'}}} open={true} variant="persistent">
                <Box sx={{display:'flex',flexDirection:"column",justifyContent:'space-between',overflowY:'hidden',height:"100%"}}>
                <List>
                    <List sx={{display:'flex',justifyContent:'center',marginBottom:'1em', marginTop:'1em'}}>
                        <Image width={200} src={logo}></Image>
                    </List>
                    <List >
                        <Typography sx={{color:'white', paddingLeft:'1em'}}>
                            Selamat Datang, {admin?.adminName}
                        </Typography>
                    </List>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/dashboard')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Dashboard style={{color: router.pathname === '/admin/dashboard' ? '#94B60F' : ''}} sx={{m:'auto',color:'white'}}></Dashboard>
                        </ListItemIcon>
                        <ListItemText style={{color: router.pathname === '/admin/dashboard' ? '#94B60F' : ''}}>
                            Dashboard
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/produk')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Inventory style={{color: router.pathname === '/admin/produk' ? '#94B60F' : ''}} sx={{m:'auto',color:'white'}}></Inventory>
                        </ListItemIcon>
                        <ListItemText style={{color: router.pathname === '/admin/produk' ? '#94B60F' : ''}}>
                            Produk
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/unit-usaha')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                                <Work style={{color: router.pathname.includes('/admin/unit-usaha') == true ? '#94B60F' : ''}} sx={{m:'auto',color:'white'}}></Work>
                            </ListItemIcon>
                            <ListItemText style={{color: router.pathname.includes('/admin/unit-usaha') == true ? '#94B60F' : ''}}>
                                Unit Usaha
                            </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/penjualan')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <ShoppingCart style={{color: router.pathname.includes('/admin/penjualan') == true ? '#94B60F' : ''}} sx={{m:'auto',color:'white'}}></ShoppingCart>
                        </ListItemIcon>
                        <ListItemText style={{color: router.pathname.includes('/admin/penjualan') == true ? '#94B60F' : ''}}>
                            Penjualan
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/pencatatan')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Wallet style={{color: router.pathname.includes('/admin/pencatatan') == true ? '#94B60F' : ''}} sx={{m:'auto',color:'white'}}></Wallet>
                        </ListItemIcon>
                        <ListItemText style={{color: router.pathname.includes('/admin/pencatatan') == true ? '#94B60F' : ''}}>
                            Pencatatan
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/keuangan')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Paid style={{color: router.pathname.includes('/admin/keuangan') == true ? '#94B60F' : ''}} sx={{m:'auto',color:'white'}}></Paid>
                        </ListItemIcon>
                        <ListItemText style={{color: router.pathname.includes('/admin/keuangan') == true ? '#94B60F' : ''}}>
                            Laporan
                        </ListItemText>
                    </ListItemButton>
                    
                   
                    
                        <ListItemButton onClick={()=>{handleChangePage('/admin/user')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <People style={{color: router.pathname.includes('/admin/user') == true ? '#94B60F' : ''}} sx={{m:'auto',color:'white'}}></People>
                                </ListItemIcon>
                                <ListItemText style={{color: router.pathname.includes('/admin/user') == true ? '#94B60F' : ''}}>
                                    Pegawai
                                </ListItemText>
                        </ListItemButton>
                    
                    
                    {
                        isSuper == true ? (
                        <>
                            <ListItemButton onClick={()=>{setOpenList(!openList)}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                                <ListItemIcon>
                                    <Folder style={{color: router.pathname.includes('/admin/konten') == true ? '#94B60F' : ''}} sx={{m:'auto',color:'white'}}></Folder>
                                </ListItemIcon>
                                <ListItemText style={{color: router.pathname.includes('/admin/konten') == true ? '#94B60F' : ''}}>
                                    Konten
                                </ListItemText>
                            </ListItemButton>
                            <Collapse in={openList}  timeout="auto" unmountOnExit>
                                <List disablePadding component="div">
                                    <ListItemButton onClick={()=>{router.push('/admin/konten/profil')}} sx={{paddingRight:"5em",paddingLeft:'1.5em'}}>
                                        <ListItemIcon>
                                            <Circle style={{color: router.pathname.includes('/admin/konten/profil') == true ? '#94B60F' : ''}} sx={{m:'auto',color:'white',fontSize:'0.4em'}}></Circle>
                                        </ListItemIcon>
                                        <ListItemText style={{color: router.pathname.includes('/admin/konten/profil') == true ? '#94B60F' : ''}}>
                                            Profil Usaha
                                        </ListItemText>
                                    </ListItemButton>
                                    <ListItemButton onClick={()=>{router.push('/admin/konten/galeri')}} sx={{paddingRight:"5em",paddingLeft:'1.5em'}}>
                                        <ListItemIcon>
                                            <Circle style={{color: router.pathname.includes('/admin/konten/galeri') == true ? '#94B60F' : ''}} sx={{m:'auto',color:'white',fontSize:'0.4em'}}></Circle>
                                        </ListItemIcon>
                                        <ListItemText style={{color: router.pathname.includes('/admin/konten/galeri') == true ? '#94B60F' : ''}}>
                                            Galeri
                                        </ListItemText>
                                    </ListItemButton>
                                    <ListItemButton onClick={()=>{router.push('/admin/konten/testimoni')}} sx={{paddingRight:"5em",paddingLeft:'1.5em'}}>
                                        <ListItemIcon>
                                            <Circle style={{color: router.pathname.includes('/admin/konten/testimoni') == true ? '#94B60F' : ''}} sx={{m:'auto',color:'white',fontSize:'0.4em'}}></Circle>
                                        </ListItemIcon>
                                        <ListItemText style={{color: router.pathname.includes('/admin/konten/testimoni') == true ? '#94B60F' : ''}}>
                                            Testimoni
                                        </ListItemText>
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </>
                        
                        ) :''
                    }
                    {
                        isSuper == true ? (
                        <>
                            <ListItemButton onClick={()=>{setOpenList2(!openList2)}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                                <ListItemIcon>
                                    <Dataset style={{color: router.pathname.includes('/admin/data-master') == true ? '#94B60F' : ''}} sx={{m:'auto',color:'white'}}></Dataset>
                                </ListItemIcon>
                                <ListItemText style={{color: router.pathname.includes('/admin/data-master') == true ? '#94B60F' : ''}}>
                                    Data Master
                                </ListItemText>
                            </ListItemButton>
                            <Collapse in={openList2} timeout="auto" unmountOnExit>
                                <List disablePadding component="div">
                                    <ListItemButton onClick={()=>{router.push('/admin/data-master/role')}} sx={{paddingRight:"5em",paddingLeft:'1.5em'}}>
                                        <ListItemIcon>
                                            <Circle style={{color: router.pathname.includes('/admin/data-master/role') == true ? '#94B60F' : ''}} sx={{m:'auto',color:'white',fontSize:'0.4em'}}></Circle>
                                        </ListItemIcon>
                                        <ListItemText style={{color: router.pathname.includes('/admin/data-master/role') == true ? '#94B60F' : ''}}>
                                            Role
                                        </ListItemText>
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </>
                        
                        ) :''
                    }
                    
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
            <Drawer onClose={()=>handleOpenMobile()} PaperProps={{sx:{backgroundColor:"#091B1C",color:"white",width:"250px", display:{
                md:'none',
                xs:'block'
            },position:"sticky", height:'100vh'}}} open={open}>
                <Box sx={{display:'flex',flexDirection:"column",justifyContent:'space-between',overflowY:'hidden',height:"100%"}}>
                <List>
                    <List sx={{display:'flex',justifyContent:'center',marginBottom:'1em', marginTop:'1em'}}>
                        <Image width={200} src={logo}></Image>
                    </List>
                    <List >
                        <Typography sx={{color:'white', paddingLeft:'1em'}}>
                            Selamat Datang, {admin?.adminName}
                        </Typography>
                    </List>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/dashboard')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Dashboard sx={{m:'auto',color:'white'}}></Dashboard>
                        </ListItemIcon>
                        <ListItemText>
                            Dashboard
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/produk')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Inventory sx={{m:'auto',color:'white'}}></Inventory>
                        </ListItemIcon>
                        <ListItemText>
                            Stock
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
                    <ListItemButton onClick={()=>{handleChangePage('/admin/penjualan')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <ShoppingCart sx={{m:'auto',color:'white'}}></ShoppingCart>
                        </ListItemIcon>
                        <ListItemText>
                            Penjualan
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/pencatatan')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Wallet sx={{m:'auto',color:'white'}}></Wallet>
                        </ListItemIcon>
                        <ListItemText>
                            Pencatatan
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{handleChangePage('/admin/keuangan')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Paid sx={{m:'auto',color:'white'}}></Paid>
                        </ListItemIcon>
                        <ListItemText>
                            Keuangan
                        </ListItemText>
                    </ListItemButton>
                    
                   
                    {
                        isSuper == true ? (<ListItemButton onClick={()=>{handleChangePage('/admin/user')}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <People sx={{m:'auto',color:'white'}}></People>
                                </ListItemIcon>
                                <ListItemText>
                                    Pegawai
                                </ListItemText>
                        </ListItemButton>) :''
                    }
                    
                    {
                        isSuper == true ? (
                        <>
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
                        </>
                        
                        ) :''
                    }
                    {
                        isSuper == true ? (
                        <>
                            <ListItemButton onClick={()=>{setOpenList2(!openList2)}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                                <ListItemIcon>
                                    <Dataset sx={{m:'auto',color:'white'}}></Dataset>
                                </ListItemIcon>
                                <ListItemText>
                                    Data Master
                                </ListItemText>
                            </ListItemButton>
                            <Collapse in={openList2} timeout="auto" unmountOnExit>
                                <List disablePadding component="div">
                                    <ListItemButton onClick={()=>{router.push('/admin/data-master/role')}} sx={{paddingRight:"5em",paddingLeft:'1.5em'}}>
                                        <ListItemIcon>
                                            <Circle sx={{m:'auto',color:'white',fontSize:'0.4em'}}></Circle>
                                        </ListItemIcon>
                                        <ListItemText>
                                            Role
                                        </ListItemText>
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </>
                        
                        ) :''
                    }
                    
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
