import style from "./GaleriCard.module.css"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Hidden } from '@mui/material';
import Image from "next/image";
import Masjid from '../../../../public/assets/images/MasjidAlBarakh.png'


const GaleriCard = () => {
    return (
            <CardActionArea className={style.CardArea} >
                <Image src={Masjid} alt="Gambar" className={style.image} />
                {/* <CardMedia
                    component="img"
                    image="../../../../public/assets/images/MasjidAlBarakh.png"
                    alt="gambar"
                    sx={{position:'relative', overflow: 'hidden',bgcolor: '#872D', width: '100%', height: '200', objectFit: 'cover'}}
                /> */}
                <CardContent sx={{ position: 'absolute',  zIndex: 1, bottom: 0, bgcolor: 'rgba(0, 0, 0, 0.85)', transition: '0.5s all', opacity: 0, color: '#fff', height: '6.5em', padding: '1em'}} className={style.hoverContent}>
                    <Typography gutterBottom variant="h5" component="div" sx={{fontSize: '1.2em', color: '#94B60F', fontWeight: 700}}>
                        Lizard
                    </Typography>
                    <Typography  sx={{fontSize: '1em'}}>
                        Lizards are a widespread group of squamate reptiles, with over 6,000
                    </Typography>
                </CardContent>
            </CardActionArea>
    )
}

export default GaleriCard;