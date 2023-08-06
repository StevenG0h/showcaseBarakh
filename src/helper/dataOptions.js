import axios from "../utils/axios";

export async function getAllUnitUsaha(){
    let unitUsahas = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'/api/unit-usahas/options');
    unitUsahas = unitUsahas?.data?.data.map((unitUsaha)=>{
        return {
            id: unitUsaha.id,
            label: unitUsaha.usahaName
        }
    })
    return unitUsahas;
}

export async function getAllUnitUsahaProduct(id){
    let unitUsahas = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'/api/unit-usaha/product-option/'+id);
    unitUsahas = unitUsahas?.data.map((product)=>{
        return {
            id: product.id,
            label: product.productName,
            price: product.productPrice
        }
    })
    return unitUsahas;
}

export async function getAllProvinsi(){
    let provinsis = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'/api/provinsi/');
    provinsis = provinsis?.data?.data.map((provinsi)=>{
        return {
            id: provinsi.id,
            label: provinsi.provinsiName
        }
    })
    return provinsis;
}

export async function getAllKotaById(id){
    let provinsis = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'/api/kota/'+id+'/all');
    provinsis = provinsis?.data.map((provinsi)=>{
        return {
            id: provinsi.id,
            label: provinsi.kota
        }
    })
    return provinsis;
}

export async function getAllKecamatanById(id){
    let provinsis = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'/api/kecamatan/'+id+'/all');
    provinsis = provinsis?.data.map((provinsi)=>{
        return {
            id: provinsi.id,
            label: provinsi.kecamatanName
        }
    })
    return provinsis;
}

export async function getAllKelurahanById(id){
    let provinsis = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'/api/kelurahan/'+id+'/all');
    provinsis = provinsis?.data.map((provinsi)=>{
        return {
            id: provinsi.id,
            label: provinsi.kelurahanName
        }
    })
    return provinsis;
}

export async function setVisitor(){
    let visitor = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'/api/visitor/');
    return visitor;
}

export async function getAdminNumber(){
    let admin = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'/api/get-number').catch(e=>{
        console.log(e)
    });
    return admin;
}