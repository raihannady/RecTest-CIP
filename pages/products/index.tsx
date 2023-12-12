import { FC } from "react";
import { GetServerSideProps } from "next";
import Product from "@/pages/api/products/produk";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Product {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  foto: string;
  suplier_id: number;
  nama_suplier: string;
}

interface ListProductsProps {
  data: Product[] | null;
}

const ListProducts: FC<ListProductsProps> = ({ data }) => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[] | null>(data);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/products/produk");
      const newData: Product[] | null = await response.json();

      setProducts(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (productId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/products/produk?id=${productId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Product deleted successfully");
        fetchData();
        router.push("/products");
      } else {
        console.error("Error deleting product:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="py-8 px-4 mx-auto max-w-screen-xl ">
        <h1 className="text-3xl text-center">Data Produk</h1>
      </div>
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search"
                    required
                  />
                </div>
              </form>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <a
                href="/products/insert"
                className="flex items-center justify-center text-black focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none "
              >
                <svg
                  className="h-3.5 w-3.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                Add product
              </a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Foto
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Nama
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Deskripsi
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Harga
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Stok
                  </th>

                  <th scope="col" className="px-4 py-3">
                    Suplier
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) &&
                  data.map((res) => (
                    <tr key={res.id} className="border-b dark:border-gray-700">
                      <td className="px-4 py-3">{res.foto}</td>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {res.nama}
                      </th>
                      <td className="px-4 py-3">{res.deskripsi}</td>
                      <td className="px-4 py-3">Rp. {res.harga}</td>
                      <td className="px-4 py-3">{res.stok}</td>

                      <td className="px-4 py-3">{res.nama_suplier}</td>
                      <td className="px-4 py-4">
                        <a
                          href={`/products/edit/${res.id}`}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline pr-3"
                        >
                          Edit
                        </a>
                        <a
                          href="#"
                          onClick={() => handleDelete(res.id)}
                          className="font-medium text-red-600 dark:text-red-500 hover:underline pr-3"
                        >
                          Delete
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps<
  ListProductsProps
> = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/products/produk");
    const data: Product[] | null = await response.json();

    console.log("API Response:", data);

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        data: null,
      },
    };
  }
};

export default ListProducts;
