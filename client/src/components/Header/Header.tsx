import Logo from "../../assets/Logo.svg";
import CloudUploadIcon from "../../assets/tabler_cloud-upload.svg";
import { getImageCountMessage } from "../../utils/helpers";
import "./Header.css";
import { useState } from "react";

interface HeaderProps {
  displayUploadArea: () => void;
  images: any;
  isLoading: boolean;
}

const Header = ({ displayUploadArea, images, isLoading }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={Logo} alt="logo" width={150} height={20} />
        {isLoading ? (
          <p className="loading-animation"></p>
        ) : (
          <p className="images-count">
            <span>{getImageCountMessage(images)} stored in keeper</span>
          </p>
        )}
      </div>
      <button className="upload-btn" onClick={() => displayUploadArea()}>
        <img src={CloudUploadIcon} alt="upload" width={24} height={24} />
        Upload image
      </button>
      <div className="bottom-line"></div>
    </header>
  );
};

export default Header;
