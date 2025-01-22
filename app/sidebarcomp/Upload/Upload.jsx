import React, { useState } from "react";
import styles from "./styles/upload.module.scss";
import { FaFileUpload } from "react-icons/fa";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "@/firebaseConfig";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file input
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Create a temporary image URL for preview
    }
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
    formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_NAME);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url; // URL of the uploaded image
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!imageFile) {
      alert("Please upload an image.");
      return;
    }

    try {
      // Upload image to Cloudinary
      const imageURL = await uploadToCloudinary(imageFile);

      // Prepare product data
      const productData = {
        title,
        description,
        price: parseFloat(price),
        imageURL, // Image URL from Cloudinary
        category,
      };

      // Save product data to Firestore
      const db = getFirestore(app);
      const productsRef = collection(db, "products");
      await addDoc(productsRef, productData);

      alert("Product uploaded successfully!");
      // Optionally, reset form after successful upload
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("Error uploading product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.upMain}>
        <div>
          <span>Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <span>Description</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <span>Price</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <span>Category</span>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>

          <span>Product Image</span>
          <div className={styles.fileInputWrapper}>
            <FaFileUpload className={styles.upIcon} />
            <p className={styles.text}>
              Drag and drop your image file here or click to browse
            </p>
            <input type="file" onChange={handleImageUpload} />
          </div>
          {imagePreview && (
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt="Selected" />
            </div>
          )}
          <button disabled={loading} onClick={handleSubmit}>
            {loading ? <div className={styles.loader}></div> : "Upload Product"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Upload;
