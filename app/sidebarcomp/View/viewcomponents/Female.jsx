import React, { useState, useEffect } from "react";
import styles from "../styles/female.module.scss";
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
  deleteDoc,
} from "firebase/firestore";
import app from "@/firebaseConfig";

const Female = () => {
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

  const db = getFirestore(app);
  // Handle toggle for a specific product
  const handleToggle = async (id, currentStatus) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        isAvailable: !currentStatus, // Toggle the value
      });

      // Update state to reflect change immediately
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id
            ? { ...product, isAvailable: !currentStatus }
            : product
        )
      );
    } catch (error) {
      console.error("Error updating availability:", error);
    }
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
  // Handle product deletion
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "products", id)); // Delete from Firestore

      // Remove deleted product from UI
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );

      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getFirestore(app);
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("category", "==", "Women"));
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
    <div className={styles.femalePage}>
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
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </div>
                <div
                  className={styles.opTabCheck}
                  onClick={() => handleToggle(product.id, product.isAvailable)}
                  style={{
                    fontSize: "24px",
                    color: product.isAvailable ? "green" : "red",
                    cursor: "pointer",
                  }}
                >
                  {product.isAvailable ? <FaToggleOn /> : <FaToggleOff />}
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

export default Female;
