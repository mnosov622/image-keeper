import React, { useState } from "react";
import "./EditLabel.css";
import CloseIcon from "../../assets/tabler_x.svg";

interface EditLabelProps {
  initialLabel: string;
  onSave: (label: string) => void;
  onCancel: () => void;
  image: any;
}

const EditLabel: React.FC<EditLabelProps> = ({ initialLabel, onSave, onCancel, image }) => {
  const [label, setLabel] = useState(initialLabel);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const blob = image instanceof Blob ? image : new Blob([image]);
  const imageToDisplay = URL.createObjectURL(blob);

  function convertToImageUrl(imageData: any) {
    if (imageData && imageData.type === "Buffer" && Array.isArray(imageData.data)) {
      const blob = new Blob([new Uint8Array(imageData.data)]);
      return URL.createObjectURL(blob);
    }
  }

  const handleSave = () => {
    onSave(label);
  };

  return (
    <div className="edit-label">
      <div className="close-editor-btn" onClick={onCancel}>
        <img src={CloseIcon} alt="close" width={24} height={24} />
        Close Editor
      </div>
      <div className="label-section">
        <div className="instructions">Edit Label</div>
        <img src={convertToImageUrl(image.image)} alt="" width={150} height={150} />
        <input
          type="text"
          placeholder=""
          value={label}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (inputValue.length <= 100) {
              setLabel(inputValue);
            }
          }}
        />
        <p className="char-count">{label.length}/100</p>
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditLabel;
