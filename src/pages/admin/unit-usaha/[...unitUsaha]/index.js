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

export async function getServerSideProps(context){
    let UnitUsaha = await axios.get('http://127.0.0.1:8000/api/unit-usaha/'+context.query.unitUsaha);
    console.log(UnitUsaha.data)
    return {
        props:{
            unitUsaha: UnitUsaha.data
        }
    }
}

export default function product({unitUsaha}){
    let {usahaName} = unitUsaha;
    let [products, setProducts] = useState(unitUsaha.products);
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
        deleteImage: yup.array().min(0)
    })

    const { control, handleSubmit, setValue, reset, register , formState:{errors}} = useForm({
        defaultValues: {
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
          deleteImages:[]
        },
        resolver: yupResolver(schema)
      })
    
      const onSubmit = async (data) => {
        data.unit_usaha_id = unitUsaha.id;
        data.deletedImage = deletedImage;
        console.log(data);
        console.log(editMode);
        if(editMode == false){
            data.productImages = data.productImages.map((image)=>{
                if(image?.isFile != false){
                    return image;
                }
            })
            const createUnitUsaha = await axios.post('/api/produk/',data,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            });
        }else{
            if(data.usahaImage == ''){
                delete data.usahaImage;
            }
            const createUnitUsaha = await axios.post('/api/produk/'+unitUsaha.id,data,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            });
            
        }
      }
      
      //states
    const [showImage, setShowImage] = useState('');
    const [AddForm, setAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [usahaId, setUsahaId] = useState('');
    
    //handler
    async function handleDelete(id){
        const csrf = await axios.get('/sanctum/csrf-cookie')
        const deleteUnitUsaha = await axios.delete('/api/produk/'+id);
        router.reload()
    }

    //state handler
    let handleOpenAddForm = ()=>{
        setAddForm(true)
    }

    let handleCloseAddForm = ()=>{
        setEditMode(false);
        setAddForm(false);
        setValue('productName','');
        setValue('productDesc','');
        setValue('productImages','');
        setValue('productStock',0);
        setValue('productPrice',0);
        setValue('deleteImage',[]);
        setUsahaId('');
        setImage([]);
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
        if(id != undefined){
            let deleteImage = deletedImage;
            deleteImage.push(id);
            setDeletedImage(deleteImage);
        }
    }
    //utils

    let TABLEHEAD = [
        {value: 'No',align: 'left'},
        {value: 'Nama produk',align: 'left'},
        {value: 'Harga',align: 'left'},
        {value: 'Action',align: 'center'}
    ]
    
    let num = 0;

    return (
        <>
            <AdminLayout>
                <Dialog open={AddForm} onClose={handleCloseAddForm} fullWidth maxWidth='xs'>
                    <DialogContent>
                        <Typography variant="h5" sx={{marginBottom:'1em'}} fontWeight={600}>Tambah Produk</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField hiddenLabel={true} label={'Nama produk'} name={"productName"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField hiddenLabel={true} label={'Deskripsi produk'} name={"productDesc"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField type="number" hiddenLabel={true} label={'Stok'} name={"productStock"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField type="number" hiddenLabel={true} label={'Harga'} name={"productPrice"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em',display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
                                <Box sx={{width:'50%'}}>
                                    <RHFDnd name="productImages[0]" onDelete={()=>{handleDeletePreview(imageData[0]?.id)}} files={imageData[0] == undefined || imageData[0] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/product/'+imageData[0]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'50%'}}>
                                    <RHFDnd name="productImages[1]" onDelete={()=>{handleDeletePreview(imageData[1]?.id)}} files={imageData[1] == undefined || imageData[1] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/product/'+imageData[1]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'50%'}}>
                                    <RHFDnd name="productImages[2]" onDelete={()=>{handleDeletePreview(imageData[2]?.id)}} files={imageData[2] == undefined || imageData[2] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/product/'+imageData[2]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'50%'}}>
                                    <RHFDnd name="productImages[3]" onDelete={()=>{handleDeletePreview(imageData[3]?.id)}} files={imageData[3] == undefined || imageData[3] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/product/'+imageData[3]?.path} control={control}></RHFDnd>
                                </Box>
                                <Box sx={{width:'50%'}}>
                                    <RHFDnd name="productImages[4]" onDelete={()=>{handleDeletePreview(imageData[4]?.id)}} files={imageData[4] == undefined || imageData[4] == null ? '' : process.env.NEXT_PUBLIC_BACKEND_URL+'/storage/product/'+imageData[4]?.path} control={control}></RHFDnd>
                                </Box>
                            </FormControl>
                            <Button variant="contained" color="success" sx={{width:'100%'}} type="submit">{editMode ? 'Simpan Perubahan' : 'Tambah Unit Usaha'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Typography variant="h3" fontWeight={400}>{usahaName}</Typography>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
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
                </Card>
            </AdminLayout>
        </>
    )
}