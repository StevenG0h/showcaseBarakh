import { bigIntToString } from "../helper/data";
import prisma from "../utils/prisma";
import * as yup from "yup";

const provinsiSchema = yup.object({
    provinsiName: yup.string().required()
})

export async function getProvinsi(id= undefined, options={
    provinsiName: "",
}){
    let provinsi = await prisma.provinsis.findMany({
        where:{
            id: id
        }
    });

    provinsi = provinsi.map(item => {
        return {
            id: bigIntToString(item.id),
            provinsiName: item.provinsiName
        }
    })

    return provinsi;
}



export async function createProvinsi(data){
    return await provinsiSchema.validate(data).then(async data => {
        try {
            let provinsi = await prisma.provinsis.create({
                data: data
            });
            return {
                data: {
                    id: bigIntToString(provinsi.id),
                    provinsiName: provinsi.provinsiName
                },
                message: provinsi.provinsiName + " berhasil ditambahkan",
                success: true
            };
        } catch (e) {
            console.log("prisma error", e);
            return {
                message: e.message,
                success: false
            };
        }
    }).catch(e =>{
        console.log("validation error", e);
        return {
            message: e.message,
            success: false
        };
    })
}

export async function updateProvinsi(data){
    return await provinsiSchema.validate(data).then(async data => {
        try {
            let provinsi = await prisma.provinsis.update(
                {
                data: data,
                where:{
                    id: data.id
                }
            });
            return {
                data: {
                    id: bigIntToString(provinsi.id),
                    provinsiName: provinsi.provinsiName
                },
                message: provinsi.provinsiName + " berhasil diperbarui",
                success: true
            };
        } catch (e) {
            console.log("prisma error", e);
            return {
                message: e.message,
                success: false
            };
        }
    }).catch(e =>{
        console.log("validation error", e);
        return {
            message: e.message,
            success: false
        };
    })
}

export async function deleteProvinsi(id = undefined){
    try {
        let provinsi = await prisma.provinsis.delete(
            {
            where:{
                id: id
            }
        });

        return {
            data: {
                id: bigIntToString(provinsi.id),
                provinsiName: provinsi.provinsiName
            },
            message: provinsi.provinsiName + " berhasil dihapus",
            success: true
        };
    }catch(e) {
        console.log("prisma error", e);
        return {
            message: e.message,
            success: false
        };
    }
}