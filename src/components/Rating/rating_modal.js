import { Rating, Container, Box, Dialog, DialogTitle, Button} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import React, {useState} from 'react';
import axios from "../../utils/axios";

const labels = {
    0.5: '😭',
    1: '😒',
    1.5: '😑',
    2: '🥱',
    2.5: '🙂',
    3: '🫡',
    3.5: '😊',
    4: '😋',
    4.5: '🥰',
    5: '🤩',
};

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const RatingModal = ({open, onClose, id }) => {
    const [value, setValue] = React.useState(2);
    const [hover, setHover] = React.useState(-1);
    const handleClose = () => {
        onClose();
    };

    const handleRating = async () => {
        let rating = await axios.put(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/produk/rating/"+id,{
            rating: value
        });
        handleClose();
    }

    return (
        <Dialog maxWidth={'xs'} open={open} onClose={handleClose} sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', 
            '& .MuiPaper-root': {padding: '1em ', gap: '1em'}
        }}>
            <DialogTitle sx={{padding: '0.5em', paddingBottom: '0', fontWeight: '700'}}>Berikan Rating Untuk Produk Kami!</DialogTitle>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: '1em',
                    alignItems: 'center',
                }}
            >
                <Rating
                    name="hover-feedback"
                    value={value}
                    precision={0.5}
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                        setHover(newHover);
                    }}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    size="large"
                />
                {value !== null && (
                    <Box sx={{fontSize: '2em'}}>{labels[hover !== -1 ? hover : value]}</Box>
                )}
            </Box>
            <Button onClick={()=>handleRating()} variant="contained" color="success" sx={{padding : '0.5em', backgroundColor: '#94B60F', color: '#fff'}}>Kirim</Button>
        </Dialog>
    )
}

export default RatingModal;