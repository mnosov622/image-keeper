import Header from "./components/Header/Header";
import ImageUploader from "./components/ImageUploader/ImageUploader";
import { useState } from "react";
import "./App.css";
import Images from "./components/Images/Images";
import { useEffect } from "react";

const App = () => {
  const [displayUpload, setDisplayUpload] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<boolean>(false); // [1
  const [images, setImages] = useState<any>([]);

  const displayUploadArea = () => {
    setDisplayUpload(true);
  };

  const hideUploadArea = () => {
    setDisplayUpload(false);
  };

  const fetchNewData = () => {
    setUpdateData(!updateData);
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/images");
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [updateData]);

  useEffect(() => {
    if (displayUpload) {
      document.body.classList.add("disable-scrolling");
    } else {
      document.body.classList.remove("disable-scrolling");
    }

    return () => {
      document.body.classList.remove("disable-scrolling");
    };
  }, [displayUpload, hideUploadArea]);

  return (
    <>
      <Header images={images} displayUploadArea={displayUploadArea} />
      {displayUpload && (
        <section className="upload-area">
          <ImageUploader fetchNewData={fetchNewData} hideUploadArea={hideUploadArea} />
        </section>
      )}
      {displayUpload && <div className="blurred-bg" />}

      <Images updateData={updateData} />
    </>
  );
};

export default App;
