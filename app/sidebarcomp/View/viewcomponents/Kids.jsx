import React, { useState, useEffect } from "react";
import styles from "../styles/kids.module.scss";
import { SlOptions } from "react-icons/sl";
import Image from "next/image";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import app from "@/firebaseConfig";

const Kids = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getFirestore(app);
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("category", "==", "Kids"));
        const querySnapshot = await getDocs(q);

        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  if (loading) {
    return <p style={{ fontSize: "16px" }}>Loading...</p>;
  }
  return (
    <>
      <div className={styles.kidsPage}>
        {products.length === 0 ? (
          <p style={{ fontSize: "16px" }}>No products available in this category.</p>
        ) : (
          
          products.map((product) => (
            <div key={product.id}>
              <SlOptions className={styles.options} />
              <div>
                <Image
                  src={product.imageURL}
                  alt={product.title}
                  width={120}
                  height={110}
                  className={styles.catImage}
                />
              </div>
              <div>
                <p>{product.title}</p>
                <p>{product.description}</p>
                <p>₦{product.price}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Kids;
