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
import { Box, Button, Checkbox, Container, Dialog, DialogContent, DialogTitle, FormControl, Grid, IconButton, StepIcon, Typography } from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import RHFTextField from '../../components/form/RHFTextField';
import RHFAutocomplete from '../../components/form/RHFAutocomplete';
import { getAllKecamatanById, getAllKelurahanById, getAllKotaById, getAllProvinsi } from '../../helper/dataOptions';
import KatalogCard from "../../components/card/KatalogCard/KatalogCard";
import { Router, useRouter } from "next/router";
// import {Checkbox} from "@mui/material";
// import WhatsApp from "../../components/Whatsapp/WhatsApp"

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
    // display: 'swap'
})

export async function getServerSideProps({ req, res }) {
    let cookie = getCookie('barakh-cart-cookie', { req, res })
    let product = await axios.get('/api/produk');
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
            product: product.data.data.data
        }
    }
}

const Cart = ({ cookie, option, totalPayment, product }) => {
    let [cartList, setCart] = useState(cookie);
    let [showCheckout, setShowCheckout] = useState(cookie.length != 0)
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
                if (cart.item + change < cart.productData.productStock) {
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
        cartList.map((product) => {

        })
        const createproduk = await axios.post('/api/client/', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        data.transactionType = "PENJUALAN"
        data.product = cartList;
        data.transactionAddress = data.clientAddress;
        data.kelurahan_id = data.clientKelurahan;
        data.client_id = createproduk.data.id;
        const createTransaction = await axios.post('/api/transaksi', data, {
            Headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        setCookie('barakh-cart-cookie', []);
        setCart([]);

        // router.replace(router.asPath);
    }

    const handleNextDialog = () => {
        setShowNotice(false);
        setCheckoutDialog(true)
    }

    const handleCloseCheckoutDialog = () => {
        setCheckoutDialog(false)
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

    return (
        <main className={poppins.className} style={{ backgroundColor: '#fff' }}>
            <Header />
            {
                showCheckout === true ?
                    (
                        <div className={style.container} >
                            <div className={style.containerCart} >
                                <p className={style.title}>Keranjang</p>
                                <div className={style.topCart}>
                                    <div className={style.pilih}>
                                        <input className={style.input} type="checkbox" />
                                        <p className={style.textPilih}>Pilih Semua</p>
                                    </div>
                                    <button onClick={() => { handleDeleteCart() }} className={style.buttonHapus}>Hapus</button>
                                </div>
                                <hr className={style.garis} />
                                <div className={style.mainCart}>
                                    <div className={style.fieldList}>
                                        {
                                            cartList.map(({ item, productData }) => {
                                                return (
                                                    <div key={productData.id} onChange={(e) => handleChangeItem(e.target.value)} className={style.fieldListProduct}>
                                                        <input onChange={(e) => {
                                                            if (e.target.checked === true) {
                                                                handleCartChecked(e.target.value)
                                                            } else {
                                                                handleCartUnchecked(e.target.value)
                                                            }
                                                        }} className={style.inputt} type="checkbox" value={productData.id} />
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
                                                                    <p className={style.price}>{formatCurrency(Number(productData.productPrice))}</p>
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
                                                <div className={style.total}>{formatCurrency(total)}</div>
                                            </div>
                                        </div>
                                        <Button onClick={() => setShowNotice(true)} sx={{ py: '1em' }} className={style.buttonBuy} variant="contained" startIcon={<FontAwesomeIcon icon={faShoppingCart}></FontAwesomeIcon>}>
                                            Lanjutkan Pembayaran
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) :
                    <Container>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <img style={{ width: '45%', margin: 'auto', marginTop: '-8em' }} src={'http://localhost:3000/assets/image/Business, Startup, workflow, error _ exhaustion, exhausted, work, laptop, computer, support 1.png'}></img>
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
                    Produk Rekomendasi
                </Typography>
                <Grid container xs={'12'} columns={12} sx={{ width: '100%' }}>
                    {
                        product.map((data) => {
                            return (
                                <Grid item xs={6} sm={4} lg={3} sx={{ padding: '0.4em' }}>
                                    <KatalogCard row={data} style={style}></KatalogCard>
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
    )
}

export default Cart;