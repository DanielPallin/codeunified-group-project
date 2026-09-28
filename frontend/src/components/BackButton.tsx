import { useNavigate } from "react-router-dom";
import "./BackButton.css";

const BackButton = ({ text }: { text: string }) => {
  const navigate = useNavigate();

  return (
    <button
      className="back-button"
      onClick={() => {
        navigate(-1);
        setTimeout(() => window.scrollTo(0, 0), 0);
      }}
    >
      ← {text}
    </button>
  );
};

export default BackButton;
