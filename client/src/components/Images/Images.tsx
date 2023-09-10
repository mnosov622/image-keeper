import React, { useEffect, useState } from "react";
import "./Images.css";
import downloadIcon from "../../assets/tabler_download.svg";
import EditIcon from "../../assets/tabler_edit.svg";
import DeleteIcon from "../../assets/tabler_trash-x.svg";
import { convertToImageUrl, formatDate } from "../../utils/helpers";
import EditLabel from "../EditLabel/EditLabel";
import { ImageData } from "../../interfaces/imageData";

interface ItemsToDisplayProps {
  updateData: boolean;
}

function ImagesDisplay({ updateData }: ItemsToDisplayProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loadingImages, setLoadingImages] = useState<boolean>(true);
  const [displayEditArea, setDisplayEditArea] = useState<boolean>(false);
  const [editImageData, setEditImageData] = useState<ImageData | null>(null);

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
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [updateData]);

  useEffect(() => {
    if (displayEditArea) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [displayEditArea]);

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

  const handleDeleteImage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      const response = await fetch(`http://localhost:4000/api/images/${id}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        fetchImages();
      } else if (response.status === 404) {
        console.log("Image not found");
      } else {
        console.error("Error deleting image:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onSave = async (label: string, id: number) => {
    try {
      const response = await fetch(`http://localhost:4000/api/images/${id}/label`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ label }),
      });

      if (response.status === 200) {
        fetchImages();
      } else {
        console.error("Failed to update image label");
      }
    } catch (error) {
      console.error("An error occurred while updating image label:", error);
    }
    setDisplayEditArea(!displayEditArea);
  };

  const selectEditLabel = (displayEditArea: boolean, imageData: ImageData) => {
    setDisplayEditArea(displayEditArea);
    setEditImageData(imageData);
  };

  // Group images by date
  const groupedImages: { [key: string]: ImageData[] } = {};
  images.forEach((imageData: ImageData) => {
    const date = formatDate(imageData.date);
    const timestamp = new Date(date).getTime();
    if (!groupedImages[timestamp]) {
      groupedImages[timestamp] = [];
    }
    groupedImages[timestamp].push(imageData);
  });

  // Sort the keys (timestamps) in descending order
  const sortedTimestamps = Object.keys(groupedImages).sort((a, b) => +b - +a);

  return (
    <div>
      <div className="images-list">
        {sortedTimestamps.map((timestamp) => (
          <div key={timestamp}>
            <h2 className="images-date">
              {formatDate(new Date(+timestamp).toISOString())}{" "}
              <span className="images-by-date-count">{groupedImages[timestamp].length}</span>
            </h2>
            <div className="image-rows">
              {groupedImages[timestamp].map((imageData: ImageData) => (
                <div
                  key={imageData.id}
                  className={`image-container ${loadingImages ? "image-loading" : ""}`}
                >
                  {imageData.image && (
                    <section className="image">
                      <img
                        className="image-section"
                        src={convertToImageUrl(imageData.image)}
                        alt={imageData.label}
                        width={200}
                        height={200}
                        onLoad={() => setLoadingImages(false)}
                      />
                      {!loadingImages && imageData.label && (
                        <p className="label">{imageData.label}</p>
                      )}
                      <section className="actions">
                        <button
                          className="action-button"
                          onClick={() => handleDownloadImage(imageData)}
                        >
                          <img src={downloadIcon} alt="download" />
                          <span>Download</span>
                        </button>
                      </section>
                      <section className="second-actions">
                        <button
                          className="action-button"
                          onClick={() => selectEditLabel(true, imageData)}
                        >
                          <img src={EditIcon} alt="edit" />
                          <span>Edit</span>
                        </button>
                      </section>
                      <section className="third-actions">
                        <button
                          className="action-button"
                          onClick={() => handleDeleteImage(imageData.id)}
                        >
                          <img src={DeleteIcon} alt="delete" />
                          <span>Delete</span>
                        </button>
                      </section>
                    </section>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {displayEditArea && (
          <EditLabel
            initialLabel={editImageData?.label || ""}
            imageData={editImageData || null}
            id={editImageData?.id || ""}
            onCancel={() => setDisplayEditArea(!displayEditArea)}
            onSave={onSave}
          />
        )}
      </div>
    </div>
  );
}

export default ImagesDisplay;
