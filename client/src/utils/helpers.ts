export const formatDate = (inputDate: string) => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(inputDate);
  return date.toLocaleDateString(undefined, options);
};

export const getImageCountMessage = (images: string) => {
  const count = images.length;
  const message = count === 1 ? "image" : "images";
  return `${count} ${message}`;
};

export const convertToImageUrl = (imageData: any) => {
  if (imageData && imageData.type === "Buffer" && Array.isArray(imageData.data)) {
    const blob = new Blob([new Uint8Array(imageData.data)]);
    return URL.createObjectURL(blob);
  }
};
