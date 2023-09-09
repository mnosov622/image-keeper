import Logo from "../../assets/Logo.svg";
import CloudUploadIcon from "../../assets/tabler_cloud-upload.svg";
import { getImageCountMessage } from "../../utils/helpers";
import "./Header.css";

interface HeaderProps {
  displayUploadArea: () => void;
  images: any;
}

const Header = ({ displayUploadArea, images }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={Logo} alt="logo" width={150} height={20} />
        <p className="images-count">{getImageCountMessage(images)}</p>
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
