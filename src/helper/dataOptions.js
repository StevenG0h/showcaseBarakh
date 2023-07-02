import axios from "@/utils/axios";

export async function getAllUnitUsaha(){
    let unitUsahas = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'/api/unit-usaha/options');
    unitUsahas = unitUsahas?.data?.data.map((unitUsaha)=>{
        return {
            id: unitUsaha.id,
            label: unitUsaha.usahaName
        }
    })
    console.log(unitUsahas)
    return unitUsahas;
}