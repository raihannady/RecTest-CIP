import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface ProductData {
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  foto: string;
  suplier_id: number;
}

interface Supplier {
  id_suplier: number;
  nama_suplier: string;
}

const edit_product: React.FC<{ productId: string }> = ({ productId }) => {
  const router = useRouter();

  const [productName, setProductName] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [supplier, setSupplier] = useState<string>("");
  const [photo, setPhoto] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [product, setProduct] = useState<ProductData | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/products/suplier"
        );

        if (response.ok) {
          const supplierData = await response.json();

          if (Array.isArray(supplierData)) {
            setSuppliers(supplierData);
          } else {
            console.error("Supplier data is not an array:", supplierData);
          }
        } else {
          console.error("Failed to fetch supplier data");
        }
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    };

    const fetchProductData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/products/produk?id=${productId}`
        );

        if (response.ok) {
          const productData: ProductData = await response.json();
          setProduct(productData);
        } else {
          console.error("Failed to fetch product data");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchSuppliers();
    fetchProductData();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const productData: ProductData = {
      nama: product?.nama || "",
      deskripsi: product?.deskripsi || "",
      harga: product?.harga || 0,
      stok: product?.stok || 0,
      foto: product?.foto || "",
      suplier_id: parseInt(product?.suplier_id?.toString() ?? "0", 10),
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/products/produk?id=${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      if (response.ok) {
        router.push("/products");
        alert("Produk berhasil diubah!");
      } else {
        console.error("Gagal mengubah produk");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log(product);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Ubah Produk
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nama Produk
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Tulis nama"
                required
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="stok"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Stok
              </label>
              <input
                type="text"
                name="stok"
                id="stok"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Stok produk"
                required
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Price (Rp.)
              </label>
              <input
                type="number"
                name="price"
                id="price"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="2999"
                required
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="supplier"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Suplier
              </label>
              {suppliers ? (
                <select
                  id="supplier"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                >
                  <option value="" disabled>
                    Select supplier
                  </option>
                  {suppliers.map((supplier) => (
                    <option
                      key={supplier.id_suplier}
                      value={supplier.id_suplier}
                    >
                      {supplier.nama_suplier}
                    </option>
                  ))}
                </select>
              ) : (
                <p>Loading suppliers...</p>
              )}
            </div>
            <div className="w-full">
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="file_input"
              >
                Upload file
              </label>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="file_input_help"
                id="file_input"
                type="file"
                accept="image/svg+xml, image/png, image/jpeg, image/gif"
              />
              <p
                className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                id="file_input_help"
              >
                SVG, PNG, JPG, or GIF (MAX. 800x400px).
              </p>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Deskripsi
              </label>
              <textarea
                id="description"
                rows={8}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Deskripsi anda disini"
                defaultValue={""}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <a
            href="/products"
            onClick={() => {}}
            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-red-500 bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Batal
          </a>

          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-blue-600 bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Ubah Produk
          </button>
        </form>
      </div>
    </section>
  );
};

export default edit_product;
