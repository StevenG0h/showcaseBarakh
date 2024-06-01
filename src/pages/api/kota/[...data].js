// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
    if (req.method == "POST") {
        res.status(200).json({ message: "Hello World" });
    }

    if (req.method == "GET") {
      res.status(200).json({ message: "Hello World2" });
    }
    
}
  