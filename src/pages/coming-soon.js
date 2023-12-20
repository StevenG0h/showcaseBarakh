
import { Inter } from 'next/font/google'
import { Poppins } from 'next/font/google'
import { Box, Button, Typography } from '@mui/material'
import ImageBrand from '../../public/assets/images/LogoBarakhFix_1.png';
import Image from 'next/image';
const poppins = Poppins({
  weight: '500',
  subsets: ['latin'],
  // display: 'swap'
})

const inter = Inter({ subsets: ['latin'] })

export default function comingSoon() {
  return (
    <main className={poppins.className}>
        <Box sx={{justifyContent:'center', alignItems:'center',gap:'1em',flexDirection:'column',width:'100%',height:'100vh',display:'flex'}}>
            <Image src={ImageBrand} width={'300'}></Image>
            <Typography variant='h5' color={'white'}>Coming Soon</Typography>
        </Box>
    </main>
  )
}
