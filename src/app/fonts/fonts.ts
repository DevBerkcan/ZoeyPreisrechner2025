import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Add weights as needed
  style: ["normal", "italic"], // Add styles as needed
  variable: "--font-poppins", // Optional: Add a custom CSS variable
});

export default poppins;
