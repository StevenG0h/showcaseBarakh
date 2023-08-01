import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

function srcset(image, size, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${size * rows
            }&fit=crop&auto=format&dpr=2 2x`,
    };
}

export default function QuiltedImageList() {
    return (
        <ImageList
            sx={{ width: "100%", height: "100%"}}
            variant="quilted"
            cols={12}
            rowHeight={100}
        >
            {itemData.map((item) => (
                <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
                    <img
                        {...srcset(item.img, 121, item.rows, item.cols)}
                        alt={item.title}
                        loading="lazy"
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}

const itemData = [
    {
        img: '../../assets/images/Atong.png',
        title: 'Breakfast',
        rows: 3,
        cols: 4,
    },
    {
        img: '../../assets/images/Fatur.png',
        title: 'Burger',
        rows: 3,
        cols: 8,
    },
    {
        img: '../../assets/images/Gelo.jpeg',
        title: 'Camera',
        cols: 9,
        rows: 3,
    },
    {
        img: '../../assets/images/Ibnu.png',
        title: 'Coffee',
        cols: 3,
        rows: 3,
    },
];