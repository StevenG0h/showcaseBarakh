import React, { useState } from "react";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';


const RatingLabel = ({value}) => {
    let rating = 0;
    value.map((data)=>{
        rating += data.rating
    })
    const res =rating / value.length;
    return (
        <Box sx={{
            '& > legend': { mt: 2 }, display: 'flex', flexDirection: 'row', gap: '0.5em'}}>
                <Typography style={{fontSize: '0.8em', color: '#94B60F', fontWeight:'600'}} underline="always">{isNaN(res) ? 0 : res.toFixed(2)}</Typography>
                <Rating sx={{
                    "& .MuiRating-iconEmpty":{
                        color: '#FAAF00'
                    }
                }} name="read-only" value={res} size="small" precision={0.5} readOnly />
        </Box>
    )
}

export default RatingLabel;