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


export default function NavVertical({data}){
    let [openList,setOpenList] = useState(false);
    return (
        <>
            <Drawer PaperProps={{sx:{backgroundColor:"#091B1C",color:"white",width:"250px",position:"sticky", height:'100vh'}}} open={true} variant="persistent">
                <Box sx={{display:'flex',flexDirection:"column",justifyContent:'space-between',overflowY:'hidden',height:"100%"}}>
                <List>
                    <List sx={{display:'flex',justifyContent:'center',marginBottom:'1em', marginTop:'1em'}}>
                        <Image width={200} src={logo}></Image>
                    </List>
                    <ListItemButton sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Dashboard sx={{m:'auto',color:'white'}}></Dashboard>
                        </ListItemIcon>
                        <ListItemText>
                            Dashboard
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Inventory sx={{m:'auto',color:'white'}}></Inventory>
                        </ListItemIcon>
                        <ListItemText>
                            Stock
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <ShoppingCart sx={{m:'auto',color:'white'}}></ShoppingCart>
                        </ListItemIcon>
                        <ListItemText>
                            Penjualan
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Wallet sx={{m:'auto',color:'white'}}></Wallet>
                        </ListItemIcon>
                        <ListItemText>
                            Keuangan
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Work sx={{m:'auto',color:'white'}}></Work>
                        </ListItemIcon>
                        <ListItemText>
                            Unit Usaha
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <People sx={{m:'auto',color:'white'}}></People>
                        </ListItemIcon>
                        <ListItemText>
                            User
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{setOpenList(!openList)}} sx={{paddingRight:"5em",paddingLeft:'0'}}>
                        <ListItemIcon>
                            <Folder sx={{m:'auto',color:'white'}}></Folder>
                        </ListItemIcon>
                        <ListItemText>
                            Content
                        </ListItemText>
                    </ListItemButton>
                    <Collapse in={openList} timeout="auto" unmountOnExit>
                        <List disablePadding component="div">
                        <ListItemButton sx={{paddingRight:"5em",paddingLeft:'1.5em'}}>
                        <ListItemIcon>
                            <Circle sx={{m:'auto',color:'white',fontSize:'0.4em'}}></Circle>
                        </ListItemIcon>
                        <ListItemText>
                            User
                        </ListItemText>
                    </ListItemButton>
                        </List>
                    </Collapse>
                </List>
                <Box sx={{height:'auto'}}>
                    <List sx={{height:'100%'}}>
                    <ListItemButton sx={{paddingRight:"5em",marginTop:'auto',marginBottom:0,paddingLeft:'0'}}>
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
        </>
    )
}