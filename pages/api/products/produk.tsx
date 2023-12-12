import { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("test.db");

interface Product {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  foto: string;
  suplier_id: number;
}

interface ProductWithSupplier extends Product {
  nama_supplier: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      getProducts(req, res);
      break;
    case "POST":
      createProduct(req, res);
      break;
    case "PUT":
      updateProduct(req, res);
      break;
    case "DELETE":
      deleteProduct(req, res);
      break;
    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}

async function getProducts(req: NextApiRequest, res: NextApiResponse) {
  const productId = req.query.id;

  if (productId) {
    // Jika ada ID yang disertakan di query parameter, ambil produk berdasarkan ID
    db.get(
      "SELECT produk.*, suplier.nama_suplier FROM produk JOIN suplier ON produk.suplier_id = suplier.id_suplier WHERE produk.id=?",
      [productId],
      (err, product: ProductWithSupplier) => {
        if (err) {
          console.error("Error executing query:", err);
          res.status(500).json({ message: `Error: ${err.message}` });
        } else if (!product) {
          res.status(404).json({ message: "Product not found" });
        } else {
          res.status(200).json(product);
        }
      }
    );
  } else {
    // Jika tidak ada ID yang disertakan, ambil semua produk dengan informasi nama suplier
    db.all(
      "SELECT produk.*, suplier.nama_suplier FROM produk JOIN suplier ON produk.suplier_id = suplier.id_suplier",
      (err, productsWithSuppliers) => {
        if (err) {
          console.error("Error executing query:", err);
          res.status(500).json({ message: `Error: ${err.message}` });
        } else {
          res.status(200).json(productsWithSuppliers);
        }
      }
    );
  }
}

function createProduct(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body as Product;
  db.run(
    "INSERT INTO produk (nama, deskripsi, harga, stok, foto, suplier_id) VALUES (?, ?, ?, ?, ?, ?)",
    [
      data.nama,
      data.deskripsi,
      data.harga,
      data.stok,
      data.foto,
      data.suplier_id,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ message: "Error creating product" });
      } else {
        res.status(201).json({ message: "Product berhasil dibuat" });
      }
    }
  );
}

function updateProduct(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body as Product;
  const productId = req.query.id; // Assuming you pass the product ID in the query

  if (!productId) {
    res.status(400).json({ message: "Product ID is required for updating" });
    return;
  }

  db.run(
    "UPDATE produk SET nama=?, deskripsi=?, harga=?, stok=?, foto=?, suplier_id=? WHERE id=?",
    [
      data.nama,
      data.deskripsi,
      data.harga,
      data.stok,
      data.foto,
      data.suplier_id,
      productId,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ message: "Error updating product" });
      } else {
        res.status(200).json({ message: "Product berhasil diupdate" });
      }
    }
  );
}

function deleteProduct(req: NextApiRequest, res: NextApiResponse) {
  const productId = req.query.id;

  if (!productId) {
    res.status(400).json({ message: "Product ID is required for deletion" });
    return;
  }

  db.run("DELETE FROM produk WHERE id=?", [productId], function (err) {
    if (err) {
      console.error("Error deleting product:", err);
      res.status(500).json({ message: "Error deleting product" });
    } else {
      res.status(200).json({ message: "Product berhasil dihapus" });
    }
  });
}
