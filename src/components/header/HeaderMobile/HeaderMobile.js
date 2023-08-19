import style from "./HeaderMobile.module.css"
import Link from "next/link";
import { Drawer, Grid, Button, List, ListItem, ListItemText, IconButton, Collapse } from "@mui/material";
import React, {useState} from "react"
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter } from "next/router";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from "@mui/material";

const headerMobile = ({ variant, anchor, ...props }) => {
    const [open, setOpen] = useState(false);
    const [openNav, setOpenNav] = useState(false);
    const router = useRouter();
    const handleClick = () => {
        setOpenNav(!openNav);
    };
    return (
        <div className={style.containerHead}>
        <Grid container justifyContent="flex-start" alignItems="center" >
            <Grid item
            >
                <Drawer
                    variant={variant}
                    anchor={anchor}
                    {...props}
                    open={open}
                    onClose={() => setOpen(false)}

                    sx={{ 
                        "& .MuiPaper-root": {
                            height:'100',
                            width: '55%', 
                            backgroundColor: '#081B1C', 
                            boxShadow: '4px 0px 18px 4px rgba(53, 53, 53, 0.14)'
                        }
                    }}
                >
                    <IconButton sx={{padding: '1em 1em 0 1em', display: 'flex', justifyContent: 'flex-end'}} onClick= {() => setOpen(false)}>
                            <ClearIcon sx={{padding: '0', color: '#FFFFFF'}}/>
                        </IconButton>
                    <List
                        sx={{
                            padding: ' 0',
                        }}
                    >   
                        <ListItem onClick={() => setOpen(false)} sx={{padding: '0 0.5em'}} >
                            <ListItemText sx={{padding: '0.5em 0.5em', margin: '0', borderRadius: '0.4em' }}>
                                <Link style={{ textDecoration: "none", color: router.pathname === '/' ? '#94B60F' : '#FFF', fontWeight: router.pathname === '/' ? '700' : ''}} href="/">
                                    Beranda
                                </Link>
                            </ListItemText>
                        </ListItem>
                        <ListItem sx={{padding: '0 0.5em'}}>
                            <ListItemText sx={{padding: '0.5em 0.5em 0.5em 0.5em', margin: '0', borderRadius: '0.4em'}}>  
                                <Link onClick={handleClick} style={{textDecoration: 'none',color: '#FFFFFF', width: '100%', display: 'flex', flexDirection: 'row'}}  href=''>
                                    <ListItemText primary="Profil" />
                                    {openNav ? <ExpandLess /> : <ExpandMore />}
                                </Link> 
                                    <Collapse sx={{paddingLeft: '1em',}} in={openNav} >
                                    <ListItem onClick={() => setOpen(false)} >
                                        <ListItemText sx={{padding: '0 0.5em', margin: '0', borderRadius: '0.4em' }} >
                                            <Link style={{ textDecoration: "none", color: router.pathname === '/profil' ? '#94B60F' : '#FFF', fontWeight: router.pathname === '/profil' ? '700' : ''}}  href="/profil">Sekilas</Link>
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem onClick={() => setOpen(false)} >
                                        <ListItemText sx={{padding: '0 0.5em', margin: '0', borderRadius: '0.4em' }} >
                                            <Link style={{ textDecoration: "none", color: router.pathname === '/profil/yayasan' ? '#94B60F' : '#FFF', fontWeight: router.pathname === '/profil/yayasan' ? '700' : ''}}  href="/profil/yayasan">Yayasan</Link>
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem onClick={() => setOpen(false)}>
                                        <ListItemText  sx={{padding: '0 0.5em', margin: '0', borderRadius: '0.4em' }}>
                                            <Link style={{ textDecoration: "none", color: router.pathname === '/profil/pesantren' ? '#94B60F' : '#FFF', fontWeight: router.pathname === '/profil/pesantren' ? '700' : ''}}  href="/profil/pesantren">Pesantren</Link>
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem onClick={() => setOpen(false)} >
                                        <ListItemText sx={{padding: '0 0.5em', margin: '0', borderRadius: '0.4em' }}>
                                            <Link style={{ textDecoration: "none", color: router.pathname === '' ? '#94B60F' : '#FFF', fontWeight: router.pathname === '' ? '700' : ''}}  href="">Galeri</Link>
                                        </ListItemText>
                                    </ListItem>
                                </Collapse>
                                {/* <KeyboardArrowDownIcon sx={{fontSize: '1.7em', position:'absolute', float : 'right',color: '#FFFFFF'}}/> */}
                            </ListItemText>
                        </ListItem>
                        <ListItem sx={{padding: '0 0.5em'}} >
                            <ListItemText sx={{padding: '0.5em 0.5em', margin: '0', borderRadius: '0.4em' }}  >
                                <Link  style={{textDecoration: "none", color: router.pathname === '/usaha' ? '#94B60F' : '#FFF', fontWeight: router.pathname === '/usaha' ? '700' : ''}}  href="/usaha">
                                    Unit Usaha
                                </Link>
                            </ListItemText>
                        </ListItem>
                        <ListItem sx={{padding: '0 0.5em'}} >
                            <ListItemText sx={{padding: '0.5em 0.5em', margin: '0', borderRadius: '0.4em' }} >
                                <Link  style={{textDecoration: "none", color: router.pathname === '/katalog' ? '#94B60F' : '#FFF', fontWeight: router.pathname === '/katalog' ? '700' : ''}}  href="/katalog">
                                    Katalog Produk
                                </Link>
                            </ListItemText>
                        </ListItem>
                        <ListItem sx={{padding: '0 0.5em'}} >
                            <ListItemText sx={{padding: '0.5em 0.5em', margin: '0', borderRadius: '0.4em' }} >
                                <Link  style={{ textDecoration: "none", color: router.pathname === '/bantuan' ? '#94B60F' : '#FFF', fontWeight: router.pathname === '/bantuan' ? '700' : ''}}  href="/bantuan">
                                    Bantuan
                                </Link>
                            </ListItemText>
                        </ListItem>
                    </List>
                </Drawer>
            </Grid>

            <Grid item>
                <Button onClick={() => setOpen(!open)} sx={{
                    padding: '0',
                    minWidth: '0px',
                }}>
                    <MenuIcon sx={{color: 'white', fontSize: '2em'}}/>
                </Button>
            </Grid>
        </Grid>
        </div>
    )
}

export default headerMobile;