import axios from "../../../utils/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import { Button, Card, Dialog, DialogContent, FormControl, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import RHFTextField from "../../../components/form/RHFTextField";
import CustomTableHead from "../../../components/table/CustomTableHead";
import UserTableRow from "../../../sections/user/UserTableRow";

export async function getServerSideProps(){
    let user = await axios.get('http://127.0.0.1:8000/api/admin');
    return {
        props:{
            user: user.data,
        }
    }
}

export default function product({user}){
    let title = 'Stock';
    let [products, setProducts] = useState(user);
    let [formTitle, setFormTitle] = useState('');
    //Next router
    const router = useRouter();

    //React hook form and YUP validator
    const schema = yup.object().shape({
        id: yup.string().required('Something wrong'),
        productPrice: yup.number().required('Harga tidak boleh kosong').min(1),
        productStock: yup.number().required('Stok tidak boleh kosong').min(1),
    })

    const { control, handleSubmit, setValue, reset, register , formState:{errors}} = useForm({
        defaultValues: {
          id:'',
          productStock:0,
          productPrice:0,
        },
        resolver: yupResolver(schema)
      })
    
      const onSubmit = async (data) => {
        if(editMode == true){
            const createuser = await axios.post('/api/user/'+data.id,data,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            });
            
        }
        handleCloseAddForm();
        router.replace(router.asPath);
      }
      
      //states
    const [AddForm, setAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);

    //state handler
    let handleChangeFilter = async (data)=>{
        if(data != '*'){
            let unitUsaha = await axios.get('/api/user/withFilter/'+data);
            setProducts(unitUsaha?.data)
        }else{
            let unitUsaha = await axios.get('/api/user/');
            setProducts(unitUsaha?.data?.data)
        }
    }

    let handleCloseAddForm = ()=>{
        setEditMode(false);
        setAddForm(false);
        setValue('id','');
        setValue('productStock',0);
        setValue('productPrice',0);
        reset({
            productStock:0,
            productPrice:0
        });
    }
    
    let handleOpenEditForm = (data)=>{
        setEditMode(true);
        setValue('id',data.id);
        setValue('productStock',data.productStock);
        setValue('productPrice',data.productPrice);
        setFormTitle(data.productName);
        setAddForm(true)
    }
    //utils

    let TABLEHEAD = [
        {value: 'No',align: 'left'},
        {value: 'Nama',align: 'left'},
        {value: 'Email',align: 'left'},
        {value: 'Nomor Whatsapp',align: 'left'},
        {value: 'Level',align: 'left'},
        {value: 'Action',align: 'left'}
    ]
    
    let num = 0;

    return (
        <>
            <AdminLayout>
                <Dialog open={AddForm} onClose={handleCloseAddForm} fullWidth maxWidth='xs'>
                    <DialogContent>
                        <Typography variant="h5" sx={{marginBottom:'1em'}} fontWeight={600}>Edit Stok</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Typography>
                                Nama user: {formTitle}
                            </Typography>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField type="number" hiddenLabel={true} label={'Stok'} name={"productStock"} control={control}></RHFTextField>
                            </FormControl>
                            <FormControl sx={{width:'100%', marginY:'0.5em'}}>
                                <RHFTextField type="number" hiddenLabel={true} label={'Harga'} name={"productPrice"} control={control}></RHFTextField>
                            </FormControl>
                            <Button variant="contained" color="success" sx={{width:'100%'}} type="submit">{editMode ? 'Simpan Perubahan' : 'Tambah Unit Usaha'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Typography variant="h3" fontWeight={400}>{title}</Typography>
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
                                            <UserTableRow 
                                            key={num} 
                                            onEdit={() => handleOpenEditForm(map)} 
                                            num={++num} row={map}>

                                            </UserTableRow>
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