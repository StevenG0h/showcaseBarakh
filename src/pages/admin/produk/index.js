import axios from "../../../utils/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { Form, useForm } from "react-hook-form";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import { Box, Button, Card, Chip, Dialog, DialogContent, FormControl, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Input, InputBase, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import RHFTextField from "../../../components/form/RHFTextField";
import RHFDnd from "../../../components/form/RHFDnd";
import CustomTableHead from "../../../components/table/CustomTableHead";
import { getAllUnitUsaha, getAllUnitUsahaAdmin } from "../../../helper/dataOptions";
import StockTableRow from "../../../sections/stock/StockTableRow";
import {getCookie} from 'cookies-next';
import  ChevronRight  from "@mui/icons-material/ChevronRight";
import  ChevronLeft  from "@mui/icons-material/ChevronLeft";
import { useEffect } from "react";
import { checkPrivilege } from "../../../helper/admin";
import  Search  from "@mui/icons-material/Search";
import ProductTableRow from "../../../sections/product/ProductTableRow";
import RHFSelect from "../../../components/form/RHFSelect";
import { ConfirmDialog } from "../../../components/dialog/ConfirmDialog";

export async function getServerSideProps({req,res}){
    let token = getCookie('token',{req,res});
    if(token == undefined){
        return {
            redirect: {
              permanent: false,
              destination: "/auth",
            },
            props:{},
          };
    }
    let admin = '';
await checkPrivilege(token).then((r)=>{
        admin = r;
    }).catch((e)=>{
        return {
            redirect: {
                permanent: false,
                destination: "/auth",
            },
            props:{},
        };
    });
    try{
        let produk = await axios.get('/api/admin/produk',{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        let unitusaha = await getAllUnitUsahaAdmin(token);
        return {
            props:{
                isSuper: admin.adminLevel == '1' ? true : false,
                admin: admin,
                produk: produk.data.data,
                options:{
                    unitUsaha: unitusaha
                }
            }
        }
    }catch(e){
        console.log(e)
        // return {
        //     redirect: {
        //       permanent: false,
        //       destination: "/auth",
        //     },
        //     props:{},
        //   };
    }
}

export default function product({isSuper,admin,produk, options}){
    let token = getCookie('token')
    let [loading, setLoading] = useState(false)
    let [products, setProducts] = useState(produk.data);
    let [productsLink, setProductsLink] = useState(produk.links);
    let [imageData, setImage] = useState([]);
    let [deletedImage, setDeletedImage] = useState([]);
    let [deleteProduct, setDeleteProduct] = useState('');
    //Next router
    const router = useRouter();

    //React hook form and YUP validator
    const schema = yup.object().shape({
        productName: yup.string().required('Nama produk tidak boleh kosong'),
        productDesc: yup.string().required('Deskripsi produk tidak boleh kosong'),
        unit_usaha_id: yup.string().required('Unit Usaha tidak boleh kosong'),
        productImages: yup.mixed().test("filesize", "Gambar tidak boleh kosong", (value) => {
            if(editMode == false){
                if(value[0] === undefined){
                    return false;
                }
                return true;
            }else{
                return true;
            }
          }),
        productDisc: yup.number("Diskon harus berupa angka").required('Diskon tidak boleh kosong').min(0),
        productPrice: yup.number().required('Harga tidak boleh kosong').min(1),
        productStock: yup.number().required('Stok tidak boleh kosong').min(1),
        satuan: yup.string().required('Satuan tidak boleh kosong').min(1),
        deletedImage: yup.array().min(0)
    })

    const { control, handleSubmit, setValue, reset, register , formState:{errors}} = useForm({
        defaultValues: {
          productId: ''  ,
          productName: "",
          productDesc: "",
          productStock:0,
          satuan: "",
          productPrice:0,
          productDisc:0,
          unit_usaha_id: '',
          productImages: [
            {
                isFile:false
            },
            {
                isFile:false
            },
            {
                isFile:false
            },
            {
                isFile:false
            },
            {
                isFile:false
            },
          ],
          deletedImages:[]
        },
        resolver: yupResolver(schema)
      })
    
      const onSubmit = async (data) => {
        data.deletedImage = deletedImage;
        setLoading(true)
        if(editMode == false){
            data.productImages = data.productImages.map((image)=>{
                if(image?.isFile != false){
                    return image;
                }
            })
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                handleCloseAddForm()
                await axios.post('/api/admin/produk',data,{
                    headers: { Authorization: `Bearer `+token,
                    'Content-Type': 'multipart/form-data'
                    },  
                    withCredentials: true
                }).then((r)=>{
                }).catch((e)=>{
                    console.log(e);
                })
            }).catch((e)=>{
                console.log(e)
            })
        }else{
            if(data.usahaImage == ''){
                delete data.usahaImage;
            }
            console.log(data)
            await axios.get('/sanctum/csrf-cookie',{
                headers: { Authorization: `Bearer `+token},
                withCredentials: true
            }).then(async (r)=>{
                await axios.post('/api/admin/produk/edit/'+data.productId,data,{
                    headers: { Authorization: `Bearer `+token,
                    'Content-Type': 'multipart/form-data'
                },
                    withCredentials: true
                }).then((r)=>{
                    console.log(r.data)
                }).catch((e)=>{
                    console.log(e);
                })
            }).catch((e)=>{
                console.log(e)
            })
        }
        handleChangeFilter(search);
        setLoading(false)
        handleCloseAddForm()
      }
      
      //states
    const [showImage, setShowImage] = useState('');
    const [AddForm, setAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [usahaId, setUsahaId] = useState('');
    
    //handler
    async function handleDelete(id){
        
        const csrf = await axios.get('/sanctum/csrf-cookie').then(async(r)=>{
            const deleteProduct = await axios.delete('/api/admin/produk/'+id,
            {headers:{
                Authorization: 'Bearer '+token
            },withCredentials:true});
        }).catch((e)=>{
            console.log(e);
        })
        router.replace(router.asPath)
        setDeleteProduct('')
    }

    //state handler
    let handleOpenAddForm = ()=>{
        setAddForm(true)
    }

    let handleCloseAddForm = ()=>{
        setEditMode(false);
        setAddForm(false);
        setValue('productId','');
        setValue('productName','');
        setValue('productDesc','');
        setValue('productImages','');
        setValue('satuan','');
        setValue('productDisc',0);
        setValue('productStock',0);
        setValue('productPrice',0);
        setValue('deleteImage',[]);
        setUsahaId('');
        setImage([]);
        setDeletedImage([])
        reset({
            productName: "",
            productImages: "",
            productDesc: "",
            productStock:0,
            productPrice:0
        });
    }
    
    let handleOpenEditForm = (data)=>{
        setEditMode(true);
        setValue('productId',data.id);
        setValue('unit_usaha_id', data.unit_usaha_id)
        setValue('productName',data.productName);
        setValue('productDesc',data.productDesc);
        setValue('productDisc',data.productDisc);
        setValue('satuan',data.satuan);
        setValue('productStock',data.productStock);
        setValue('productPrice',data.productPrice);
        setImage(data.product_images);
        
        setAddForm(true)
    }
   
    let handleShowImage = (data)=>{
        setShowImage(process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/unitUsaha/'+data)
    }
    
    let handleCloseShowImage = (data)=>{
        setShowImage('')
    }

    let handleDeletePreview = (id)=>{
        alert(id)
        if(id != undefined){
            let deleteImage = deletedImage;
            deleteImage.push(id);
            setDeletedImage(deleteImage);
            setDeleteProduct('')
        }
    }

    let handleChangePage = async (link)=>{
        if(link != null){
            try{
                let unitUsaha = await axios.get(link,{
                    headers:{
                        Authorization: 'Bearer '+token,
                    },
                    withCredentials:true
                });
                setProducts(unitUsaha?.data.data.data)
                setProductsLink(unitUsaha?.data.data.links)
            }catch(e){
                console.log(e)
            }
        }
    }

    //utils

    let TABLEHEAD = [
        {value: 'No',align: 'left'},
        {value: 'Nama produk',align: 'left'},
        {value: 'Stok',align: 'left'},
        {value: 'Harga',align: 'left'},
        {value: 'Diskon',align: 'left'},
        {value: 'Dibuat pada',align: 'left'},
        {value: 'Terakhir diedit',align: 'left'},
        {value: 'Action',align: 'center'}
    ]
    
    let num = 0;

    let [search, setSearch] = useState({
        id:'all',
        orderBy:'desc',
        keyword:'',
        harga:''
    });

    let handleChangeFilter = async (data)=>{
        let unitUsaha = await axios.post('/api/admin/produk/search',data,{
            headers:{
                Authorization: 'Bearer '+token
            },
            withCredentials: true
        });
        setProducts(unitUsaha?.data?.data)
        setProductsLink(unitUsaha?.data?.links)
    }

    useEffect(() => {
        setProducts(produk.data)
        setProductsLink(produk.links)
      }, [produk]);

    return (
        <>
         <ConfirmDialog onCancel={()=>setDeleteProduct('')} msg={'Anda yakin ingin menghapus produk '+deleteProduct.productName+" ?"} title={"Hapus Produk"} open={deleteProduct != ''} onConfirm={()=>handleDelete(deleteProduct.id)}></ConfirmDialog>
            <AdminLayout isSuper={isSuper} admin={admin} handleLoading={loading}>
                <Dialog open={AddForm} sx={{overflow:'hidden'}} onClose={handleCloseAddForm} fullWidth maxWidth='xs'>
                    <DialogContent>
                        <Typography variant="h5" sx={{marginBottom:'1em'}} fontWeight={600}>Tambah Produk</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField hiddenLabel={false} label={'Nama produk'} name={"productName"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                            <RHFSelect sx={{width:'100%'}}
                                    name={'unit_usaha_id'}
                                    option={options.unitUsaha}
                                    control= {control}
                                    label={"Unit Usaha"}
                            />
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField hiddenLabel={false} label={'Deskripsi produk'} name={"productDesc"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField type="number" hiddenLabel={false} label={'Stok'} name={"productStock"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField type="number" hiddenLabel={false} label={'Harga'} name={"productPrice"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField type="number" hiddenLabel={false} label={'Diskon (%)'} name={"productDisc"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField hiddenLabel={false} label={'Satuan'} name={"satuan"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{marginY:'0.5em',display:'flex', flexDirection:'row', flexWrap:'wrap', width:'99%',overflow:'hidden'}}>
                                <Box sx={{width:'99%'}}>
                                    <RHFDnd required={ editMode == true ? false : true } name="productImages[0]" onDelete={()=>{handleDeletePreview(imageData[0]?.id)}} files={imageData[0] == undefined || imageData[0] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/product/'+imageData[0]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'49%'}}>
                                    <RHFDnd name="productImages[1]" onDelete={()=>{handleDeletePreview(imageData[1]?.id)}} files={imageData[1] == undefined || imageData[1] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/product/'+imageData[1]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'49%'}}>
                                    <RHFDnd name="productImages[2]" onDelete={()=>{handleDeletePreview(imageData[2]?.id)}} files={imageData[2] == undefined || imageData[2] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/product/'+imageData[2]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'49%'}}>
                                    <RHFDnd name="productImages[3]" onDelete={()=>{handleDeletePreview(imageData[3]?.id)}} files={imageData[3] == undefined || imageData[3] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/product/'+imageData[3]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'49%'}}>
                                    <RHFDnd name="productImages[4]" onDelete={()=>{handleDeletePreview(imageData[4]?.id)}} files={imageData[4] == undefined || imageData[4] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/product/'+imageData[4]?.path} control={control}></RHFDnd>
                                </Box>
                            </FormControl>
                            <Button variant="contained" color="success" sx={{width:'100%'}} type="submit">{editMode ? 'Simpan Perubahan' : 'Tambah Produk'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Typography variant="h3" color={'#94B60F'} sx={{textDecoration:'underline'}} fontWeight={400}>Produk</Typography>
                <Box sx={{display:'flex', gap:'1em', marginY:'1em', flexDirection:'row',flexWrap:'wrap'}}>
                    <Typography variant="h6" sx={{margin:0}}>
                        Unit Usaha:
                    </Typography>
                    <Button color="success" variant={search.id === 'all' ? 'contained' : 'outlined'} sx={{borderRadius:'5em'}} 
                    onClick={()=>{
                        let searchData = search;
                        searchData.id = 'all';
                        setSearch(searchData);
                        handleChangeFilter(searchData);
                    }}>Semua</Button>
                    {
                        options.unitUsaha.map((unitUsaha)=>{
                            return (
                                <Button color="success" variant={search.id === unitUsaha.id ? 'contained' : 'outlined'} sx={{borderRadius:'5em'}} onClick={()=>{let searchData = search;
                                    searchData.id = unitUsaha.id;
                                    setSearch(searchData);
                                    handleChangeFilter(searchData);}}>{unitUsaha.label}</Button>
                            )
                        })
                    }
                    
                </Box>
                <form onSubmit={(e)=>{
                    e.preventDefault();
                    handleChangeFilter(search)
                }}>
                    <Box sx={{display:'flex', gap:'1em', alignItems:'start', justifyContent:'space-between',flexDirection:{
                                lg:'row',
                                xs:'column'
                            }}}>
                            <Card sx={{width:{
                                    lg:'30%',
                                    xs:'100%'
                                },borderRadius:'5em',display:'flex',flexDirection:'row',justifyContent:'stretch'}}>
                                        <FormControl sx={{backgroundColor:'white',width:'100%'}}>
                                            <InputBase placeholder="ketik untuk mencari produk" defaultValue={search.keyword} onChange={(e)=>{
                                                let data = search;
                                                data.keyword =e.target.value;
                                                setSearch(data);
                                            }} sx={{borderRadius:'5em', paddingY:'0.5em',width:'100%',outline:'none',"& fieldset": { border: 'none' },paddingLeft:'1em'}}>
                                            
                                            </InputBase>
                                        </FormControl>
                                <IconButton type="submit" variant="contained" color="success" sx={{height:'100%',paddingY:'0.5em', borderRadius:'0'}}>
                                    <Search></Search>
                                </IconButton>
                            </Card>
                            <Button sx={{my:'auto'}} onClick={handleOpenAddForm} color="success" variant="contained" startIcon="">
                                Tambah Produk
                            </Button>
                        </Box>
                </form>
                
                <Card sx={{marginY:'1em'}}>
                    
                    <TableContainer>
                        <Table>
                            <CustomTableHead tableHead={TABLEHEAD}></CustomTableHead>
                            <TableBody>
                                {
                                    products.length === 0 ? (
                                        <TableRow>
                                            <TableCell>Data kosong</TableCell>
                                        </TableRow>
                                    ) :
                                    products?.map((map)=>{
                                        return ( <>
                                            <ProductTableRow 
                                            key={map.id} 
                                            onDelete={() => setDeleteProduct(map)} 
                                            onEdit={() => handleOpenEditForm(map)} 
                                            onShowImage={()=> handleShowImage(map.usahaImage)}
                                            num={++num} row={map}>

                                            </ProductTableRow>
                                        </>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                    {
                            productsLink.map((link,index)=>{
                                return (
                                    <Button fullWidth size="sm" sx={{margin:'0.5em',paddingY:'1em', paddingX:'0', width:0, height:0}} key={link.label} variant={link.active ? 'contained' : 'outlined'} color={'success'} onClick={()=> handleChangePage(link.url)}>{
                                        link.label == '&laquo; Previous'? <ChevronLeft ></ChevronLeft> : link.label == 'Next &raquo;' ? <ChevronRight></ChevronRight> : link.label
                                    }</Button>
                                )
                            })
                        }
                    </Box>

                    
                </Card>
            </AdminLayout>
        </>
    )
}
