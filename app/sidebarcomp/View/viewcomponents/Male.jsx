import React, { useState, useEffect } from "react";
import styles from "../styles/male.module.scss";
import { SlOptions } from "react-icons/sl";
import Image from "next/image";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import app from "@/firebaseConfig";

const Male = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProductId, setActiveProductId] = useState(null);
  const [toggleStates, setToggleStates] = useState({}); // Stores toggle states by product ID
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    title: "",
    description: "",
    price: "",
  });

  // Handle toggle for a specific product
  const handleToggle = (id) => {
    setToggleStates((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the state for the specific product ID
    }));
  };

  const handleOptionsClick = (id) => {
    setActiveProductId(activeProductId === id ? null : id); // Toggle active product popup
  };
  const openEditModal = (product) => {
    setEditData({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    const db = getFirestore(app);
    const productRef = doc(db, "products", editData.id);

    try {
      await updateDoc(productRef, {
        title: editData.title,
        description: editData.description,
        price: Number(editData.price),
      });
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editData.id
            ? { ...product, ...editData, price: Number(editData.price) }
            : product
        )
      );
      setIsEditModalOpen(false); // Close modal after saving
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getFirestore(app);
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("category", "==", "Men"));
        const querySnapshot = await getDocs(q);

        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsData);

        // Initialize toggle states for each product
        const initialToggleStates = productsData.reduce((acc, product) => {
          acc[product.id] = product.available || false; // Use product availability or default to false
          return acc;
        }, {});
        setToggleStates(initialToggleStates);

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
    <div className={styles.malePage}>
      {products.length === 0 ? (
        <p className={styles.noProductsText}>
          No products available in this category.
        </p>
      ) : (
        products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            {/* Options Icon */}
            <SlOptions
              className={styles.options}
              onClick={() => handleOptionsClick(product.id)}
            />

            {/* Product Image */}
            <div>
              <Image
                src={product.imageURL}
                alt={product.title}
                width={120}
                height={110}
                className={styles.catImage}
              />
            </div>

            {/* Product Details */}
            <div className={styles.catBody}>
              <p>{product.title}</p>
              <p>{product.description}</p>
              <p>₦{product.price}</p>
            </div>

            {/* Popup */}
            {activeProductId === product.id && (
              <div className={styles.popup}>
                <div
                  className={styles.opTab}
                  onClick={() => openEditModal(product)}
                >
                  Edit
                </div>
                <div
                  className={styles.opTab}
                  onClick={() => console.log("Delete Clicked")}
                >
                  Delete
                </div>
                <div
                  className={styles.opTabCheck}
                  onClick={() => handleToggle(product.id)}
                  style={{
                    fontSize: "24px",
                    color: toggleStates[product.id] ? "green" : "red",
                    cursor: "pointer",
                  }}
                >
                  {toggleStates[product.id] ? <FaToggleOn /> : <FaToggleOff />}
                </div>
              </div>
            )}
          </div>
        ))
      )}
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit Product</h2>
            <span>Title</span>

            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleEditChange}
            />

            <span>Description</span>

            <input
              name="description"
              value={editData.description}
              onChange={handleEditChange}
            />

            <span>Price (₦)</span>

            <input
              type="number"
              name="price"
              value={editData.price}
              onChange={handleEditChange}
            />
            <div className={styles.modalActions}>
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Male;
