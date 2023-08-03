import React, { useState } from "react";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';


const RatingLabel = () => {
    const [value, setValue] = useState(3);
    return (
        <Box sx={{
            '& > legend': { mt: 2 }, display: 'flex', flexDirection: 'row', gap: '0.5em'}}>
                <Typography style={{fontSize: '0.8em',textDecoration: 'underline', color: '#94B60F'}} underline="always">{value}</Typography>
                <Rating name="read-only" value={value} size="small" precision={0.5} readOnly />
        </Box>
    )
}

export default RatingLabel;