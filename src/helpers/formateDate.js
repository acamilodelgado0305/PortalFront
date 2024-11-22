export const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    if (today.toDateString() === messageDate.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return messageDate.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };