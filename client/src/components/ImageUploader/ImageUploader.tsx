import { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import UploadIcon from "../../assets/upload.svg";
import "./ImageUploader.css";

interface ImageUploaderProps {
  hideUploadArea: () => void;
  fetchNewData: () => void;
}

function ImageUploader({ hideUploadArea, fetchNewData }: ImageUploaderProps) {
  const [label, setLabel] = useState<string>("");

  const getCurrentDate = () => {
    return new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      const image = acceptedFiles[0];

      const blob = image instanceof Blob ? image : new Blob([image]);

      const formData = new FormData();
      formData.append("image", blob);

      const currentDate = getCurrentDate();

      formData.append("label", label);
      formData.append("date", currentDate);

      try {
        const response = await fetch("http://localhost:4000/api/images", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          hideUploadArea();
          fetchNewData();
        } else {
          console.error("Image upload failed.");
        }
      } catch (error) {
        console.error("An error occurred while uploading the image.", error);
      }
    },
    [label, hideUploadArea]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        <input {...getInputProps()} />
        <>
          <img src={UploadIcon} alt="Upload" width={80} height={65} />
          <h3>Upload file</h3>
          <input
            type="text"
            placeholder="Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <p>Drop your file here to start uploading</p>
        </>
      </div>
    </div>
  );
}

export default ImageUploader;
