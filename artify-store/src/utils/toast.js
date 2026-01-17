let setToastMessage = null;

export const registerToast = (setter) => {
  setToastMessage = setter;
};

export const showToast = (message) => {
  if (setToastMessage) {
    setToastMessage(message);

    // auto clear after animation
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }
};