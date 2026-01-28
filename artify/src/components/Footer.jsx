import "./style/footer.css";
import instagram from "../assets/icons/instagram.svg";
import facebook from "../assets/icons/facebook.svg";
import mail from "../assets/icons/mail.svg";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { auth } = useAuth();
  if (auth?.role === "admin") return null;

  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-left">
          <h3>Contact Us</h3>
          <p><strong>Email:</strong> artifystore@gmail.com</p>
          <p><strong>Phone:</strong> +91 9876543210</p>
        </div>

        <div className="footer-right">
          <div className="footer-icons">
            <a href="https://www.instagram.com/artify" target="_blank" rel="noopener noreferrer">
              <img src={instagram} alt="Instagram" className="social-icon" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={facebook} alt="Facebook" className="social-icon" />
            </a>
            <a href="mailto:artifystore@gmail.com">
              <img src={mail} alt="Email" className="social-icon" />
            </a>
          </div>
        </div>
      </div>
      <p className="footer-copy">© 2026 Artify — All rights reserved.</p>
    </footer>
  );
}