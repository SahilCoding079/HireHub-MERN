import { Toaster } from "react-hot-toast";

const Toast = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        duration: 3000,

        style: {
          background: "#ffffff",
          color: "#1f2937",
          borderRadius: "10px",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow:
            "0 10px 25px rgba(0, 0, 0, 0.08)",
        },

        success: {
          duration: 3000,
          iconTheme: {
            primary: "#16a34a",
            secondary: "#ffffff",
          },
        },

        error: {
          duration: 4000,
          iconTheme: {
            primary: "#dc2626",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
};

export default Toast;