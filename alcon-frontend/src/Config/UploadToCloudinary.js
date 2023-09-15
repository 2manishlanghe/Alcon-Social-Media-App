export const uploadToCloudinary = async (image) => {
  if (image) {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Alcon_app");
    data.append("cloud_name", "dsnwvub4a");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dsnwvub4a/image/upload",
      {
        method: "post",
        body: data,
      }
    );

    const fileData = await res.json();
    console.log("url : ", fileData.url.toString());
    return fileData.url.toString();
  } else {
    console.log("error");
  }
};
