// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { deleteProvinsi } from "../../../../services/provinsiService";

async function remove(id, res) {
    let provinsi = await deleteProvinsi(id);

    if (provinsi.success == true) {
        return res.status(200).json({provinsi})
    } else {
        return res.status(500).json({provinsi});
    }
}


export default async function handler(req, res) {
    if (req.method == "DELETE") {
        return await remove(req.query.id[0], res);
    }   
}
  