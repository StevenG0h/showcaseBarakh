import style from './notice.module.css'

const Message = ({ isVisible, CloseClick, handleNext }) => {
    if (!isVisible) return null;

    const handleClose = (e) => {
        if(e.target.id === 'card' ) CloseClick;
    } 

    return(
        <div className={style.container}>
            <div className={style.card} id='card' onClick={handleClose}>
            <div className={style.buttonContainer}>
                <p className={style.buttonClose} onClick={() => CloseClick()}>x</p>
            </div>
                <div className={style.title}>Penting!</div>
                <div className={style.description}>Kami hanya menyediakan pembayaran VIA Aplikasi Whatsapp</div>
                <div className={style.fieldTotal}>
                    <div className={style.textTotal}>Total Belanja Anda</div>
                    <div className={style.Total}>Rp.180.000,00.</div>
                </div>
                <button onClick={()=>handleNext()} className={style.button}>Lanjutkan Pembayaran</button>
            </div>
        </div>
    )
}

export default Message;