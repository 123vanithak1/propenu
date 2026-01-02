import Toast from "react-native-toast-message";

const showToast = ({
  type = "success",
  title = "",
  message = "",
  duration = 3000,
}) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: "top",
    visibilityTime: duration,
    autoHide: true,
  });
};

export const ToastSuccess = (message, title = "Success") =>
  showToast({ type: "success", title, message });

export const ToastError = (message, title = "Error") =>
  showToast({ type: "error", title, message });

export const ToastInfo = (message, title = "Info") =>
  showToast({ type: "info", title, message });
