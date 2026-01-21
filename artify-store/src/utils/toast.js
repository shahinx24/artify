let setToastMessage = null;

export const registerToast = (setter) => {
  setToastMessage = setter;
};

export const showToast = (message) => {
  if (setToastMessage) {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }
};