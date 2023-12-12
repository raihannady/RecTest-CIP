import { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("test.db");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    db.all("SELECT * FROM suplier", (err, suppliers: Supplier[]) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ message: `Error: ${err.message}` });
      } else {
        res.status(200).json(suppliers);
      }
    });
  } else if (req.method === "POST") {
    const data = req.body as Supplier;
    db.run(
      "INSERT INTO suplier (nama_suplier, alamat, email) VALUES (?, ?, ?)",
      [data.nama_suplier, data.alamat, data.email],
      function (err) {
        if (err) {
          res.status(500).json({ message: "Error creating supplier" });
        } else {
          res.status(201).json({ message: "Supplier berhasil ditambahkan" });
        }
      }
    );
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

interface Supplier {
  nama_suplier: string;
  alamat: string;
  email: string;
}
