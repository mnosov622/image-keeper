import Header from "./components/Header/Header";
import ImageUploader from "./components/ImageUploader/ImageUploader";
import { useState } from "react";
import "./App.css";
import Images from "./components/Images/Images";
import { useEffect, useCallback } from "react";
import { ImageData } from "./interfaces/imageData";
import { backendUrl } from "./constants/backend";

const App = () => {
  const [displayUpload, setDisplayUpload] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<boolean>(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setIsLoading] = useState<boolean>(true);

  const displayUploadArea = () => {
    setDisplayUpload(true);
  };

  const hideUploadArea = useCallback(() => {
    setDisplayUpload(false);
  }, []);

  const fetchNewData = () => {
    setUpdateData(!updateData);
  };

  const setLoadingImages = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };

  useEffect(() => {
    if (displayUpload) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [displayUpload]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/images`);
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
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
      <Header images={images} displayUploadArea={displayUploadArea} isLoading={loading} />
      {displayUpload && (
        <section className="upload-area">
          <ImageUploader fetchNewData={fetchNewData} hideUploadArea={hideUploadArea} />
        </section>
      )}
      {displayUpload && <div className="blurred-bg" />}

      <Images
        setUpdateData={setUpdateData}
        updateData={updateData}
        images={images}
        isLoading={loading}
        setLoadingImages={setLoadingImages}
      />
    </>
  );
};

export default App;
