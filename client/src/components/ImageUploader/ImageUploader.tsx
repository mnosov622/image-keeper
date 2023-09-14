import { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import UploadIcon from "../../assets/upload.svg";
import CloseIcon from "../../assets/tabler_x.svg";
import CheckIcon from "../../assets/tabler_check.svg";
import "./ImageUploader.css";
import { backendUrl } from "../../constants/backend";

interface ImageUploaderProps {
  hideUploadArea: () => void;
  fetchNewData: () => void;
}

function ImageUploader({ hideUploadArea, fetchNewData }: ImageUploaderProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [image, setImage] = useState<FileWithPath | null>(null);
  const [label, setLabel] = useState<string>("");
  const [charCount, setCharCount] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const getCurrentDate = () => {
    return new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
    setError("");
    const image = acceptedFiles[0];
    if (image.type.startsWith("image/") && !image.type.endsWith("svg+xml")) {
      const imageUrl = URL.createObjectURL(image);
      setImage(image);
      setImageSrc(imageUrl);
    } else {
      setError("File is not an image.");
    }
  }, []);

  const upload = async () => {
    if (image?.type.startsWith("image/")) {
      const blob = image instanceof Blob ? image : new Blob([image]);

      const formData = new FormData();
      formData.append("image", blob);

      const currentDate = getCurrentDate();

      formData.append("label", label);
      formData.append("date", currentDate);

      try {
        const response = await fetch(`${backendUrl}/api/images`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const imageUrl = URL.createObjectURL(image);
          setImageSrc(imageUrl);
          setLabel("");
          setCharCount(0);
          hideUploadArea();
          fetchNewData();
        } else {
          console.error("Image upload failed.");
        }
      } catch (error) {
        console.error("An error occurred while uploading the image.", error);
      }
    } else {
      console.error("File is not an image.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <button className="close-editor-btn" onClick={() => hideUploadArea()}>
        <img src={CloseIcon} alt="close" width={24} height={24} />
        Close Editor
      </button>
      {!imageSrc ? (
        <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
          <input {...getInputProps()} />
          <>
            <img src={UploadIcon} alt="Upload" width={80} height={65} />
            <h3>Upload file</h3>

            <p className="instructions-text">Drop your file here to start uploading</p>

            {error && (
              <div className="error-section">
                <p className="error-red">Sorry, but</p>
                <p className="error-normal">{error}</p>
              </div>
            )}
          </>
        </div>
      ) : (
        <div className="image-preview">
          <h2 className="instructions">Set Custom Label</h2>
          <img src={imageSrc} alt="Uploaded" width={150} height={150} />
          <section className="label-section">
            <input
              type="text"
              placeholder="Enter custom label"
              value={label}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue.length <= 100) {
                  setLabel(inputValue);
                  setCharCount(inputValue.length);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <p className="char-count">{charCount}/100 chars max</p>
          </section>
          <button className="save-btn" onClick={() => upload()}>
            <img src={CheckIcon} alt="check" width={24} height={24} />
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
