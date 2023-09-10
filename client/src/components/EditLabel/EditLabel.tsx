import React, { ChangeEvent, useState } from "react";
import "./EditLabel.css";
import CloseIcon from "../../assets/tabler_x.svg";
import { convertToImageUrl } from "../../utils/helpers";
import { ImageData } from "../../interfaces/imageData";

interface EditLabelProps {
  initialLabel: string;
  onSave: (label: string, id: number) => void;
  onCancel: () => void;
  imageData: ImageData | null;
  id: string;
}

const EditLabel: React.FC<EditLabelProps> = ({ initialLabel, onSave, onCancel, imageData, id }) => {
  const [label, setLabel] = useState(initialLabel);

  const handleSave = () => {
    onSave(label, Number(id));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 100) {
      setLabel(inputValue);
    }
  };

  return (
    <div className="edit-label">
      <div className="close-editor-btn" onClick={onCancel}>
        <img src={CloseIcon} alt="close" width={24} height={24} />
        Close Editor
      </div>
      <div className="label-section">
        <div className="instructions">Edit Label</div>
        <img src={convertToImageUrl(imageData?.image)} alt="" width={150} height={150} />
        <input type="text" placeholder="Enter custom label" value={label} onChange={handleChange} />
        <p className="char-count">{label.length}/100</p>
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditLabel;
