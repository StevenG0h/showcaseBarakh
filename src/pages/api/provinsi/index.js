// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { createProvinsi, getProvinsi, updateProvinsi } from "../../../services/provinsiService";



async function get() {
  let provinsi = await getProvinsi();

  return provinsi;
}

async function create(data, res) {
  let provinsi = await createProvinsi(data);
  if (provinsi.success == true) {
    return res.status(200).json({provinsi})
} else {
    return res.status(500).json({provinsi});
  }
}

async function update(data, res) {
  let provinsi = await updateProvinsi(data);
  if (provinsi.success == true) {
    return res.status(200).json({provinsi})
  } else {
      return res.status(500).json({provinsi});
  }
}

export default async function handler(req, res) {
    if (req.method == "GET") {
      res.status(200).json({ data: await get() });
    }

    if (req.method == "POST") {
      return await create(req.body, res);
    }

    if (req.method == "PUT") {
      return await update(req.body, res)
    }
}
  