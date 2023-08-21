import style from "./GaleriCard.module.css"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, Hidden } from '@mui/material';
import Image from "next/image";
import Masjid from '../../../../public/assets/images/MasjidAlBarakh.png'


const GaleriCard = ({data}) => {
    return (
            <CardActionArea className={style.CardArea}>
                <img src={process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/galeri/' + data.path} alt="Gambar" className={style.image}/>
                {/* <CardMedia
                    component="img"
                    image="../../../../public/assets/images/MasjidAlBarakh.png"
                    alt="gambar"
                    sx={{position:'relative', overflow: 'hidden',bgcolor: '#872D', width: '100%', height: '200', objectFit: 'cover'}}
                /> */}
                <CardContent sx={{ position: 'absolute', width:'100%',  zIndex: 1, bottom: 0, bgcolor: 'rgba(0, 0, 0, 0.8)', transition: '0.5s all', opacity: 0, color: '#fff', height: '40%',  display: 'flex', flexDirection: 'column', padding:0}} className={style.hoverContent}>
                    <Box sx={{padding:'1em'}}>
                        <Typography sx={{fontSize: '0.9em', display: 'flex', justifyContent: 'flex-end'}}>{data.galeriDate }</Typography>
                        <Typography gutterBottom variant="h5" component="div" sx={{fontSize: '1.2em', color: '#94B60F', fontWeight: 700}}>
                            {data.galeriTitle }
                        </Typography>
                        <Typography  sx={{fontSize: '0.9em', lineHeight: '1.3em'}}>
                
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
    )
}

export default GaleriCard;