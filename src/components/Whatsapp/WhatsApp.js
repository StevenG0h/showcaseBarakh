import style from './WhatsApp.module.css'
import Link from 'next/link';
import WhatsAPpImage from '../../../public/assets/images/whatsappLogo.svg'
import Image from 'next/image';

const WhatsApp = () => {
    return(
        <>
        <a href='' className={style.container}>
            <Image src={WhatsAPpImage} alt='Gambar' className={style.WhatsApp}/>
        </a>
        </>
    )
}

export default WhatsApp ;