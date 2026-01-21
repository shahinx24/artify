import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENV } from "../constants/env";
import { ROUTES } from "../constants/routes";
import { saveUser } from "../utils/userHelpers";
import { showToast } from "../utils/toast";

export function useAuth(setUser) {
      const [form, setForm] = useState({
        email: "",
        pass: "",
        confirm: ""
      });

      const navigate = useNavigate();

      const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };

      const login = async (e) => {
      e.preventDefault();

      const { email, pass } = form;
      if (!email || !pass) {
        showToast("All fields required");
        return;
      }

      const { data: users } = await axios.get(
        `${ENV.API_BASE_URL}/users`
      );

      const found = users.find(
        (u) => u.email === email && u.pass === pass
      );

      if (!found) {
        showToast("Invalid credentials");
        return;
      }

      await saveUser(found);
      setUser(found);     
      showToast("Logged in successfully");
      navigate(ROUTES.HOME);
    };

      const register = async (e) => {
        e.preventDefault();

        const { email, pass, confirm } = form;

        if (!email || !pass || !confirm) {
          showToast("All fields required");
          return;
        }

        if (pass !== confirm) {
          showToast("Passwords do not match");
          return;
        }

        await axios.post(`${ENV.API_BASE_URL}/users`, {
          email,
          pass,
          cart: [],
          wishlist: []
        });

        showToast("Account created successfully");
        navigate(ROUTES.LOGIN);
      };

      return { handleChange, login, register,form };
}