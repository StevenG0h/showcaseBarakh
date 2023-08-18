import axios from "../../../../utils/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import AdminLayout from "../../../../layouts/adminLayout/AdminLayout";
import { Box, Button, Card, Dialog, DialogContent, FormControl, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Input, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import RHFTextField from "../../../../components/form/RHFTextField";
import CustomTableHead from "../../../../components/table/CustomTableHead";
import ProductTableRow from "../../../../sections/product/ProductTableRow";
import  Delete  from "@mui/icons-material/Delete";
import  Star  from "@mui/icons-material/Star";
import RHFDnd from "../../../../components/form/RHFDnd";
import {getCookie} from 'cookies-next';
import { getAllUnitUsaha } from "../../../../helper/dataOptions";
import  ChevronRight  from "@mui/icons-material/ChevronRight";
import  ChevronLeft  from "@mui/icons-material/ChevronLeft";
import { useEffect } from "react";

export async function getServerSideProps({req,res,query}){
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
    await axios.get('/user',{
        headers:{
            Authorization: 'Bearer '+token,
        },
        withCredentials:true
    }).catch((e)=>{
        return {
            redirect: {
              permanent: false,
              destination: "/auth",
            },
            props:{},
          };
    })
    try{
        let produk = await axios.get('/api/admin/unit-usaha/'+query.unitUsaha,{
            headers:{
                Authorization: 'Bearer '+token,
            },
            withCredentials:true
        });
        return {
            props:{
                unitUsaha: produk.data.unitUsaha,
                product: produk.data.product
            }
        }
    }catch(e){
        console.log(e)
        return {
            redirect: {
              permanent: false,
              destination: "/auth",
            },
            props:{},
          };
    }
}

export default function product({unitUsaha,product}){
    let token = getCookie('token')
    let [loading, setLoading] = useState(false)
    let {usahaName} = unitUsaha;
    let [products, setProducts] = useState(product.data);
    let [productsLink, setProductsLink] = useState(product.links);
    let [imageData, setImage] = useState([]);
    let [deletedImage, setDeletedImage] = useState([]);
    let [imageBackup, setImageBackup] = useState([]);
    //Next router
    const router = useRouter();

    //React hook form and YUP validator
    const schema = yup.object().shape({
        productName: yup.string().required('Nama unit usaha tidak boleh kosong'),
        productDesc: yup.string().required('Deskripsi unit usaha tidak boleh kosong'),
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
        productPrice: yup.number().required('Harga tidak boleh kosong').min(1),
        productStock: yup.number().required('Stok tidak boleh kosong').min(1),
        deletedImage: yup.array().min(0)
    })

    const { control, handleSubmit, setValue, reset, register , formState:{errors}} = useForm({
        defaultValues: {
          productId: ''  ,
          productName: "",
          productDesc: "",
          productStock:0,
          productPrice:0,
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
        data.unit_usaha_id = unitUsaha.id;
        data.deletedImage = deletedImage;
        setLoading(true)
        if(editMode == false){
            data.productImages = data.productImages.map((image)=>{
                if(image?.isFile != false){
                    return image;
                }
            })
            console.log(data)
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
                    console.log(r.data)
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
        router.replace(router.asPath);
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
            const deleteUnitUsaha = await axios.delete('/api/admin/produk/'+id,
            {headers:{
                Authorization: 'Bearer '+token
            },withCredentials:true});
        }).catch((e)=>{
            console.log(e);
        })
        router.replace(router.asPath)
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
        setValue('productName',data.productName);
        setValue('productDesc',data.productDesc);
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
                console.log(unitUsaha.data)
                setProducts(unitUsaha?.data.product.data)
                setProductsLink(unitUsaha?.data.product.links)
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
        {value: 'Dibuat pada',align: 'left'},
        {value: 'Terakhir diedit',align: 'left'},
        {value: 'Action',align: 'center'}
    ]
    
    let num = 0;

    useEffect(() => {
        setProducts(product.data)
        setProductsLink(product.links)
      }, [product]);

    return (
        <>
            <AdminLayout handleLoading={loading}>
                <Dialog open={AddForm} sx={{overflow:'hidden'}} onClose={handleCloseAddForm} fullWidth maxWidth='xs'>
                    <DialogContent>
                        <Typography variant="h5" sx={{marginBottom:'1em'}} fontWeight={600}>Tambah Produk</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField hiddenLabel={false} label={'Nama produk'} name={"productName"} control={control}></RHFTextField>
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
                            <FormControl sx={{marginY:'0.5em',display:'flex', flexDirection:'row', flexWrap:'wrap', width:'99%',overflow:'hidden'}}>
                                <Box sx={{width:'99%'}}>
                                    <RHFDnd name="productImages[0]" onDelete={()=>{handleDeletePreview(imageData[0]?.id)}} files={imageData[0] == undefined || imageData[0] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/product/'+imageData[0]?.path} control={control}></RHFDnd>
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
                <Typography variant="h3" color={'#94B60F'} sx={{textDecoration:'underline'}} fontWeight={400}>{usahaName}</Typography>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginY:'1em'}}>
                    <Button onClick={handleOpenAddForm} color="success" variant="contained" startIcon="">
                        Tambah Produk
                    </Button>
                </Box>
                <Card sx={{marginY:'1em'}}>
                    <TableContainer>
                        <Table>
                            <CustomTableHead tableHead={TABLEHEAD}></CustomTableHead>
                            <TableBody>
                                {
                                    products === [] || products==='' || products === undefined ? (
                                        <TableRow>
                                            <TableCell>Data kosong</TableCell>
                                        </TableRow>
                                    ) :
                                    products?.map((map)=>{
                                        return ( <>
                                            <ProductTableRow 
                                            key={map.id} 
                                            onDelete={() => handleDelete(map.id)} 
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