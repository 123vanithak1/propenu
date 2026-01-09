// src/utils/toast.js
import Toast from "react-native-toast-message";

const showToast = ({
  type = "success",
  message = "",
  duration = 3000,
}) => {
  Toast.show({
    type,
    text2: message,
    position: "top",
    visibilityTime: duration,
    autoHide: true,
  });
};

export const ToastSuccess = (message) =>
  showToast({ type: "success", message });

export const ToastError = (message) =>
  showToast({ type: "error", message });

export const ToastInfo = (message) =>
  showToast({ type: "info", message });
