import React, { useEffect, useState } from "react";
import "./Images.css";
import downloadIcon from "../../assets/tabler_download.svg";
import EditIcon from "../../assets/tabler_edit.svg";
import DeleteIcon from "../../assets/tabler_trash-x.svg";

interface ImageData {
  id: string;
  label: string;
  image: any;
}

interface ItemsToDisplayProps {
  updateData: boolean;
}

function ImagesDisplay({ updateData }: ItemsToDisplayProps) {
  const [images, setImages] = useState<any>([]);

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

  const handleDownloadImage = (imageData: any) => {
    if (imageData && imageData.image && Array.isArray(imageData.image.data)) {
      const blob = new Blob([new Uint8Array(imageData.image.data)], {
        type: "image/png",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image_${imageData.id}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <h1>Images</h1>
      <div className="images-list">
        {images.map((imageData: ImageData, index: number) => (
          <div key={imageData.id} className="image-container">
            {imageData.image && (
              <section className="images">
                <img
                  className="image-section"
                  src={convertToImageUrl(imageData.image)}
                  alt={imageData.label}
                  width={200}
                  height={200}
                />

                {imageData.label && <p className="label">{imageData.label}</p>}

                <section className="actions">
                  <button className="action-button" onClick={() => handleDownloadImage(imageData)}>
                    <img src={downloadIcon} alt="download" />
                    <span>Download</span>
                  </button>
                </section>

                {/* <section className="actions">
                  <button className="action-button">
                    <img src={EditIcon} alt="edit" />
                    <span>Edit label</span>
                  </button>
                </section>

                <section className="actions">
                  <button className="action-button">
                    <img src={DeleteIcon} alt="delete" />
                    <span>Delete</span>
                  </button>
                </section> */}
              </section>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function convertToImageUrl(imageData: any) {
  if (imageData && imageData.type === "Buffer" && Array.isArray(imageData.data)) {
    const blob = new Blob([new Uint8Array(imageData.data)]);
    return URL.createObjectURL(blob);
  }
}

export default ImagesDisplay;