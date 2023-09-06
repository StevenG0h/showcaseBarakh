import style from "./cart.module.css"
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import imageCart from "../../../public/assets/images/cart.png";
import NoticeModal from "../../components/NoticeModal/notice_modal"
import Image from "next/image";
import Link from "next/link";
import { Poppins } from 'next/font/google'
import { getCookie, setCookie } from "cookies-next";
import axios from "../../utils/axios";
import { formatCurrency } from "../../helper/currency";
import { Box, Button, Checkbox, Container, Dialog, DialogContent, DialogTitle, FormControl, Grid, IconButton, StepIcon, ThemeProvider, Typography, createTheme } from "@mui/material";
import {useEffect} from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faShoppingCart, faCheck } from "@fortawesome/free-solid-svg-icons";
import RHFTextField from '../../components/form/RHFTextField';
import RHFAutocomplete from '../../components/form/RHFAutocomplete';
import { getAllKecamatanById, getAllKelurahanById, getAllKotaById, getAllProvinsi } from '../../helper/dataOptions';
import KatalogCard from "../../components/card/KatalogCard/KatalogCard";
import { Router, useRouter } from "next/router";
import Head from "next/head";
import { ConfirmDialog } from "../../components/dialog/ConfirmDialog";
// import {Checkbox} from "@mui/material";
// import WhatsApp from "../../components/Whatsapp/WhatsApp"

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
})

export async function getServerSideProps({ req, res }) {
    let cookie = getCookie('barakh-cart-cookie', { req, res })
    let product = await axios.get('/api/produk/katalog').catch(e=>{
        console.log(e)
    });
    let provinsi = await getAllProvinsi();
    let count = 0;
    console.log(product)
    if(cookie != undefined){
        cookie = JSON.parse(cookie)
        cookie.map((data) => {
            count += data.item * Number(data.productData.productPrice)
        })
    }
    return {
        props: {
            cookie: cookie === undefined ? [] : cookie,
            option: {
                provinsi: provinsi
            },totalPayment: count,
            products: product.data.data.data
        }
    }
}

const Cart = ({ cookie, option, totalPayment, products }) => {
    let [cartList, setCart] = useState(cookie);
    let [product, setProduct] = useState(products);
    let [showCheckout, setShowCheckout] = useState(cookie.length != 0)
    let [showAlert, setShowAlert] = useState(false);
    let [total, setTotal] = useState(totalPayment);
    const router = useRouter()
    let [checked, setChecked] = useState([]);
    let [deleteCart, setDelete] = useState([]);
    let [checkoutDialog, setCheckoutDialog] = useState(false);
    let [location, setLocation] = useState({
        provinsi: '',
        kota: '',
        kecamatan: '',
        kelurahan: ''
    })
    let [kota, setKota] = useState([]);
    let [kecamatan, setKecamatan] = useState([]);
    let [kelurahan, setKelurahan] = useState([]);
    const [showNotice, setShowNotice] = useState(false);

    const handleChangeItem = (id, change) => {
        let newCartList = cartList.map((cart) => {
            if (cart.productData.id === id) {
                if (cart.item + change <= cart.productData.productStock) {
                    cart.item += change
                    if (cart.item > 0 == false) {
                        cart.item = 1;
                    }
                    let newCookie = cookie.map((map) => {
                        if (map.productId === id) {
                            map.item = cart.item
                        }
                        return map;
                    })
                    setCookie('barakh-cart-cookie', newCookie)
                }
            }
            
            return cart
        })
        setCart(newCartList);
        countTotal()
    }

    const schema = yup.object().shape({
        clientName: yup.string().required('Nama tidak boleh kosong'),
        clientEmail: yup.string().required('Email tidak boleh kosong'),
        clientNum: yup.string().required('Nomor WhatsApp tidak boleh kosong'),
        provinsi: yup.string().required('Nomor WhatsApp tidak boleh kosong'),
        kota: yup.string().required('Nomor WhatsApp tidak boleh kosong'),
        kecamatan: yup.string().required('Nomor WhatsApp tidak boleh kosong'),
        clientKelurahan: yup.string().required('Kelurahan tidak boleh kosong'),
        clientAddress: yup.string().required('Alamat lengkap tidak boleh kosong'),
    })

    const { control, handleSubmit, getValues, setValue, reset, register, formState: { errors } } = useForm({
        defaultValues: {
            clientName: '',
            clientEmail: '',
            clientNum: '',
            provinsi: '',
            kota: '',
            kecamatan: '',
            clientKelurahan: '',
            clientAddress: '',
        },
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data) => {
        
        const createproduk = await axios.post('/api/client', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        let unitUsahas = [];
        let cart = cartList.filter((cartData)=>{
            if(unitUsahas.includes(cartData.productData.unit_usaha_id) == false){
                unitUsahas.push(cartData.productData.unit_usaha_id)
            }
            if(checked.includes(cartData.productData.id)== true){
                return true;
            }
        })
        data.transactionType = "PENJUALAN"
        data.transactionAddress = data.clientAddress;
        data.provinsi_id = location.provinsi;
        data.kota_id = location.kota;
        data.kecamatan_id = location.kecamatan;
        data.client_id = createproduk.data.id;
        data.kelurahan_id = data.clientKelurahan;
        await unitUsahas.map(async(unitUsaha)=>{
            console.log('unitUsaha',unitUsaha)
            let unitUsahaProduct = cart.filter((cartData)=>{
                if(cartData.productData.unit_usaha_id == unitUsaha){
                    return true;
                }
            })
            data.product = unitUsahaProduct;
            const createTransaction = await axios.post('/api/transaksi', data, {
                Headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            let msg = 'Halo, '+data.clientName+', berikut ini data diri dan belanjaan kamu'+'%0a'+
            'Alamat: '+data.clientAddress +'%0a'+
            'Nama: '+data.clientName + '%0a'+
            'Email: '+data.clientNum + '%0a'+
            'Keranjang: '+'\n';
            let total = 0;
            console.log('filtered product', unitUsahaProduct);
            let product = cart.map((produk)=>{
                let cart = '- '+produk.productData.productName + ' ' + produk.item + 'x '+produk.productData.productPrice+'%0a'
                total += produk.productData.productPrice * produk.item
                return msg+= cart
            })
            msg = msg+'%0a'+ 'total: Rp.' + total
        
            window.open('https://api.whatsapp.com/send/?phone='+createTransaction.data.adminNumber.unit_usaha.admin.adminNum+"&text="+msg);
            
        })
        let newCart = cartList.filter((cartData)=>{
            if(checked.includes(cartData.productData.id)!=true){
                return cartData
            }
        })
        setCookie('barakh-cart-cookie', newCart);
        setCart(newCart);
        handleCloseCheckoutDialog()
        // router.replace(router.asPath);
    }

    const handleNextDialog = () => {
        setShowNotice(false);
        setCheckoutDialog(true)
    }

    const handleCloseCheckoutDialog = () => {
        setCheckoutDialog(false)
        setTotal(0  )
    }

    const handleProvinsi = async (id) => {
        setValue('provinsi', id)
        let newLocation = location
        newLocation.provinsi = id
        setLocation(newLocation)
        setKota(await getAllKotaById(id));
    }

    const handleKota = async (id) => {
        setValue('kota', id)
        let newLocation = location
        newLocation.kota = id
        setLocation(newLocation)
        setKecamatan(await getAllKecamatanById(id));
    }

    const handleKecamatan = async (id) => {
        setValue('kecamatan', id)
        let newLocation = location
        newLocation.kecamatan = id
        setLocation(newLocation)
        setKelurahan(await getAllKelurahanById(id));
    }

    const handleKelurahan = async (id) => {
        setValue('clientKelurahan', id)
    }

    const handleCartChecked = (id) => {
        let addChecked = checked
        addChecked.push(id);
        setChecked(addChecked);
        countTotal(addChecked);
    }

    const handleCartUnchecked = (id) => {
        let addChecked = checked.filter((checkedId) => {
            return checkedId != id
        })
        setChecked(addChecked);
    }

    const handleDeleteCart = () => {
        let cookie = getCookie('barakh-cart-cookie')
        cookie = JSON.parse(cookie)
        let newCookie = cookie.filter((cart) => {
            let isInCart = false;
            checked.map((id) => {
                (cart.productId)
                if (id == cart.productId) {
                    isInCart = true
                }
            })
            return isInCart !== true
        })
        setCookie('barakh-cart-cookie', newCookie);
        setCart(newCookie);
        countTotal(newCookie)
        if (newCookie.length === 0) {
            setShowCheckout(false)
        }
    }

    const countTotal = (cart) => {
        let count = 0;
         cart = cartList.filter((cartData)=>{
            if(checked.includes(cartData.productData.id)== true){
                return true;
            }
        })
        if (cart == undefined) {
            cartList.map((data) => {
                count += data.item * Number(data.productData.productPrice)
            })
        } else {
            cart.map((data) => {
                count += data.item * Number(data.productData.productPrice)
            })
        }
        setTotal(count)
    }

    useEffect(() => {
        setCart(cookie)
        setShowCheckout(cookie.length !=0)
        setTotal(totalPayment)
        setProduct(product)
        handleCheckAll()
      }, [cookie, option, totalPayment, product]);

      function handleCheckAll(){
            console.log(cartList.length);
          if(checked.length < cartList.length){
            let check = [];
            cartList.map((cart)=>{
                check.push(cart.productId)
            })
            console.log(check)
            setChecked(check)
        }
        console.log(checked)
      }

      const theme = createTheme({
        palette:{
          main:'#94B60F',
          success: {
            main:'#94B60F',
            contrastText: '#ffffff'
          }
        }
      })

    return (
        <ThemeProvider theme={theme}>
        <main className={poppins.className} style={{ backgroundColor: '#fff' }}>
            <ConfirmDialog open={showAlert} onCancel={()=>setShowAlert(false)} onConfirm={()=>setShowAlert(false)} msg={"Anda harus memilih salah satu produk untuk melanjutkan checkout"}></ConfirmDialog>
            <Head>
                <title>Albarakh | Keranjang</title>
            </Head>
            <Header />
            {
                showCheckout === true ?
                    (
                        <div className={style.container} >
                            <div className={style.containerCart} >
                                <p className={style.title}>Keranjang</p>
                                <div className={style.topCart}>
                                    <div className={style.pilih}>
                                        <Button color="success" variant="contained" startIcon={<FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>} onClick={()=>handleCheckAll()}>
                                            Pilih Semua
                                        </Button>
                                    </div>
                                    <button onClick={() => { handleDeleteCart() }} className={style.buttonHapus}>Hapus</button>
                                </div>
                                <hr className={style.garis} />
                                <div className={style.mainCart}>
                                    <div className={style.fieldList}>
                                        {
                                            cartList.map(({ item, productData, productId }) => {
                                                return (
                                                    <div key={productData.id} onChange={(e) => handleChangeItem(e.target.value)} className={style.fieldListProduct}>
                                                        <input onChange={(e) => {   
                                                            if (e.target.checked === true) {
                                                                handleCartChecked(Number(e.target.value))
                                                                console.log(checked)
                                                            } else {
                                                                handleCartUnchecked(Number(e.target.value))
                                                                console.log(checked)
                                                            }
                                                        }} className={style.inputt} checked={checked.includes(Number(productId))} type="checkbox" value={productData.id} />
                                                        <div className={style.list}>
                                                            <div className={style.image}>
                                                                <img style={{ aspectRatio: '2/2', objectFit: 'cover', margin: 'auto', borderRadius: '0.6em', width: '100%', height: '100%' }} src={process.env.NEXT_PUBLIC_BACKEND_URL + "/storage/product/" + productData.product_images[0].path} alt="Gambar" className={style.imageCart} />
                                                            </div>
                                                            <div className={style.detailProductCart}>
                                                                <Link href={"/detail-produk/" + productData.id} className={style.link}>
                                                                    <p className={style.productName}>{productData.productName}</p>
                                                                </Link>
                                                                <div className={style.remaining}>
                                                                    <p className={style.remainingCheck}>sisa {productData.productStock}</p>
                                                                    <p className={style.price}>Rp.{formatCurrency(Number(productData.productPrice))}</p>
                                                                </div>
                                                                <div className={style.detailSetProduct}>
                                                                    <div className={style.setAmount}>
                                                                        <IconButton sx={{ border: '0.1em solid grey', aspectRatio: '1/1', width: '2em', height: '2em', fontSize: '1em' }} onClick={() => handleChangeItem(productData.id, -1)}>
                                                                            <FontAwesomeIcon icon={faMinus}>
                                                                            </FontAwesomeIcon>
                                                                        </IconButton>
                                                                        <Typography>
                                                                            {item}
                                                                        </Typography>
                                                                        <IconButton sx={{ border: '0.1em solid grey', aspectRatio: '1/1', width: '2em', height: '2em', fontSize: '1em' }} onClick={() => handleChangeItem(productData.id, 1)}>
                                                                            <FontAwesomeIcon icon={faPlus}>
                                                                            </FontAwesomeIcon>
                                                                        </IconButton>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className={style.ringkasanBelanja}>
                                        <div className={style.descRingkasan}>
                                            <p className={style.titleRingkasan}>Ringkasan Belanja</p>
                                            <div className={style.detailPrice}>
                                                <div className={style.textTotal}>Total Belanja Anda : </div>
                                                <div className={style.total}>Rp.{formatCurrency(total)}</div>
                                            </div>
                                        </div>
                                        <Button onClick={() => {
                                            if(checked.length > 0){
                                                setShowNotice(true)
                                            }else{
                                                setShowAlert(true)
                                            }
                                        }} sx={{ py: '1em' }} color="success" variant="contained" startIcon={<FontAwesomeIcon icon={faShoppingCart}></FontAwesomeIcon>}>
                                            Lanjutkan Pembayaran
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) :
                    <Container>
                        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '2em' }}>
                            <img className={style.imageProdukKosong} src={'http://albarakh.com/assets/image/keranjangkosong.png'}></img>
                            <Typography textAlign={'center'}>
                                Yuk isi dengan produk produk unggulan!
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', margin: '1em' }}>
                                <Button variant={'contained'} color={'success'} onClick={() => router.push('/katalog')}>
                                    Mulai Belanja
                                </Button>
                            </Box>
                        </Box>
                    </Container>
            }
            <Container sx={{ marginBottom: '4em'}} className={style.containerRekomendasi}>
                <Typography variant="h5" sx={{fontSize: '2em', fontWeight: '600', textDecoration: 'underline', textUnderlineOffset: '0.4em', textDecorationColor: '#94B60F', marginBottom: '1em'}} className={style.titleRekom}>
                    Produk Lainnya
                </Typography>
                <Grid container xs={'12'} columns={12} sx={{ width: '100%' }}>
                    {
                        product.map((data) => {
                            return (
                                <Grid item xs={6} sm={4} lg={3} sx={{ padding: '0.4em' }}>
                                    <KatalogCard isCart={true} row={data} style={style}></KatalogCard>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Container>
            <Footer />
            <NoticeModal total={total} handleNext={() => handleNextDialog()} isVisible={showNotice} CloseClick={() => setShowNotice(false)} />
            <Dialog open={checkoutDialog} maxWidth={'xs'} onClose={() => { handleCloseCheckoutDialog() }} fullWidth>
                <DialogTitle>
                    Form data diri
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                        <FormControl sx={{ width: '100%' }}>
                            <RHFTextField control={control} name={'clientName'} label={'Nama Lengkap'} hiddenLabel={false}></RHFTextField>
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <RHFTextField control={control} name={'clientEmail'} label={'Email'} hiddenLabel={false}></RHFTextField>
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <RHFTextField control={control} name={'clientNum'} label={'No. Whatsapp'} hiddenLabel={false}></RHFTextField>
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <RHFAutocomplete name={'provinsi'} label={'Provinsi'} handleChange={(id) => { handleProvinsi(id) }} options={option.provinsi} control={control} disable={false} hiddenLabel={false}></RHFAutocomplete>
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <RHFAutocomplete name={'kota'} label={'Kabupaten/kota'} handleChange={(id) => { handleKota(id) }} options={kota} control={control} disable={location.provinsi === '' ? true : false} hiddenLabel={false}></RHFAutocomplete>
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <RHFAutocomplete name={'kecamatan'} label={'Kecamatan'} handleChange={(id) => { handleKecamatan(id) }} control={control} options={kecamatan} disable={location.kota === '' ? true : false} hiddenLabel={false}></RHFAutocomplete>
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <RHFAutocomplete name={'clientKelurahan'} label={'Kelurahan'} handleChange={(id) => { handleKelurahan(id) }} control={control} options={kelurahan} disable={location.kecamatan === '' ? true : false} hiddenLabel={false}></RHFAutocomplete>
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <RHFTextField control={control} name={'clientAddress'} label={'Alamat lengkap'} hiddenLabel={false}></RHFTextField>
                        </FormControl>
                        <Button type="submit" className={style.buttonBuy} variant="contained" sx={{ width: '100%', marginTop: '1em' }}>
                            Lanjut Pembayaran
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </main>
        </ThemeProvider>
    )
}

export default Cart;