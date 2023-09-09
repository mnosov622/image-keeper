export const formatDate = (inputDate: string) => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(inputDate);
  return date.toLocaleDateString(undefined, options);
};

export const getImageCountMessage = (images: string) => {
  const count = images.length;
  const message = count === 1 ? "image" : "images";
  return `${count} ${message} stored in keeper`;
};
