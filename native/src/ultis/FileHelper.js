import * as DocumentPicker from "expo-document-picker";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../api/firebase";
import * as ImagePicker from "expo-image-picker";
import { deleteFile, updateFile } from "../redux/uploadSlice";
import {
  deleteSongFromUserAsync,
  postSongFromUserAsync,
} from "../redux/audioCloudSlice";

export const pickAndConfigureFile = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: "audio/*",
  });

  if (result.assets) {
    let newResult = { ...result };
    newResult.assets[0].name = newResult.assets[0].name.substring(
      0,
      newResult.assets[0].name.length - 4
    );

    return { ...newResult, access: "public", image: null, progress: 0 };
  } else {
    return null;
  }
};

export const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    // aspect: [4, 3],
    quality: 1,
  });
  if (result.assets) {
    return result;
  } else {
    return null;
  }
};

export const uploadFileToFirebaseV2 = async (item) => {
  if (Platform.OS === "android") {
    try {
      const storageRef = ref(storage, `Stuff/${item.assets[0].name}`);
      const response = await fetch(item.assets[0].uri);
      const blob = await response.blob();

      const snapshot = uploadBytesResumable(storageRef, blob, {
        contentType: "audio/mpeg", // Ví dụ: "audio/mpeg" cho file MP3
      });

      const audioUploadProgress = new Promise((resolve) => {
        snapshot.on("state_changed", (taskSnapshot) => {
          const progress =
            (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
          console.log(`Audio Progress: ${progress}%`);
          if (taskSnapshot.state === "success") {
            resolve();
          }
        });
      });

      const uploadPromises = [audioUploadProgress];
      let imageSnapshot = null;

      if (item.image) {
        const imageTypes = {
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          gif: "image/gif",
        };

        // Xác định loại MIME dựa trên phần mở rộng của tệp ảnh (ví dụ: jpg, png)
        const imageExtension = item.image.split(".").pop().toLowerCase();
        const contentType = imageTypes[imageExtension];

        if (!contentType) {
          console.error("Loại ảnh không được hỗ trợ");
          return null;
        }

        const imageStorageRef = ref(storage, `Image/${item.assets[0].name}`);
        const imageResponse = await fetch(item.image);
        const imageBlob = await imageResponse.blob();

        imageSnapshot = uploadBytesResumable(imageStorageRef, imageBlob, {
          contentType: contentType, // Thay đổi contentType cho phù hợp với loại ảnh
        });

        const imageUploadProgress = new Promise((resolve) => {
          imageSnapshot.on("state_changed", (taskSnapshot) => {
            const progress =
              (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
            console.log(`Image Progress: ${progress}%`);
            if (taskSnapshot.state === "success") {
              resolve();
            }
          });
        });
        uploadPromises.push(imageUploadProgress);
      }

      // Đợi cả hai tải lên hoàn thành
      await Promise.all(uploadPromises).then((response) => {
        console.log("done");
      });

      const audioDownloadURL = await getDownloadURL(snapshot.ref);
      let imageDownloadURL = null;

      if (item.image) {
        imageDownloadURL = await getDownloadURL(imageSnapshot.ref);
      }

      return { audioURL: audioDownloadURL, imageURL: imageDownloadURL };
    } catch (error) {
      console.error("Lỗi khi tải lên tệp:", error);
      return null;
    }
  } else {
    // Xử lý trên các nền tảng khác
    return null;
  }
};

export const uploadFileToFirebaseV3 = async (item, dispatch, token) => {
  if (Platform.OS === "android") {
    try {
      let audioDownloadURL = null;
      let imageDownloadURL = null;
      if (item.image) {
        const imageTypes = {
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          gif: "image/gif",
        };

        // Xác định loại MIME dựa trên phần mở rộng của tệp ảnh (ví dụ: jpg, png)
        const imageExtension = item.image.split(".").pop().toLowerCase();
        const contentType = imageTypes[imageExtension];

        if (!contentType) {
          console.error("Loại ảnh không được hỗ trợ");
          return null;
        }

        const imageStorageRef = ref(storage, `Image/${item.assets[0].name}`);
        const imageResponse = await fetch(item.image);
        const imageBlob = await imageResponse.blob();

        imageSnapshot = uploadBytesResumable(imageStorageRef, imageBlob, {
          contentType: contentType, // Thay đổi contentType cho phù hợp với loại ảnh
        });

        const trackUploadProgress = async () => {
          return new Promise((resolve) => {
            imageSnapshot.on("state_changed", (taskSnapshot) => {
              const progress =
                (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
              console.log(`ProgressImage: ${progress}%`);
              if (taskSnapshot.bytesTransferred === taskSnapshot.totalBytes) {
                const _storageRef = ref(
                  storage,
                  `Image/${item.assets[0].name}`
                );
                setTimeout(() => {
                  getDownloadURL(_storageRef)
                    .then((url) => {
                      console.log("URL của image:", url);
                      imageDownloadURL = url;
                      resolve(url);

                      // Ở đây, bạn có thể sử dụng biến `url` để thực hiện công việc cần thiết với URL của tệp.
                    })
                    .catch((error) => {
                      console.error("Lỗi khi lấy URL:", error);
                    });
                }, 2000);
              }
            });
          });
        };

        await trackUploadProgress();
      }

      const storageRef = ref(storage, `Stuff/${item.assets[0].name}`);
      const response = await fetch(item.assets[0].uri);
      const blob = await response.blob();

      const snapshot = uploadBytesResumable(storageRef, blob, {
        contentType: "audio/mpeg", // Ví dụ: "audio/mpeg" cho file MP3
      });

      const audioUploadProgress = async () => {
        return new Promise((resolve) => {
          snapshot.on("state_changed", (taskSnapshot) => {
            const progress =
              (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
            console.log(`Progress: ${progress}%`);
            dispatch(updateFile({ ...item, progress: progress }));
            if (taskSnapshot.bytesTransferred === taskSnapshot.totalBytes) {
              const _storageRef = ref(storage, `Stuff/${item.assets[0].name}`);
              setTimeout(() => {
                getDownloadURL(_storageRef)
                  .then((url) => {
                    console.log("URL của tệp:", url);
                    console.log(item);
                    console.log(imageDownloadURL);
                    resolve(url);
                    dispatch(deleteFile(item));

                    dispatch(
                      postSongFromUserAsync({
                        nameSong: item.assets[0].name,
                        linkSong: url,
                        image: imageDownloadURL ? imageDownloadURL : "null",
                        access: item.access,
                        token: token,
                      })
                    );
                    return {
                      audioURL: audioDownloadURL,
                      imageURL: imageDownloadURL,
                    };
                    // Ở đây, bạn có thể sử dụng biến `url` để thực hiện công việc cần thiết với URL của tệp.
                  })
                  .catch((error) => {
                    console.error("Lỗi khi lấy URL:", error);
                  });
              }, 2000);
            }
          });
        });
      };
      audioUploadProgress();
    } catch (error) {
      console.error("Lỗi khi tải lên tệp:", error);
      return null;
    }
  } else {
    // Xử lý trên các nền tảng khác
    return null;
  }
};

export const deleteFileFromFirebase = async (item, dispatch, token) => {
  try {
    console.log(typeof item.img);
    let storageRef = ref(storage, `Stuff/${item.nameSong}`);
    await deleteObject(storageRef);
    if (item.img !== "null") {
      storageRef = ref(storage, `Image/${item.nameSong}`);
      await deleteObject(storageRef);
    }

    await dispatch(
      deleteSongFromUserAsync({
        idSong: item.id,
        token: token,
      })
    );

    // Xóa tệp tin trên Firebase Storage

    // Xóa thành công
    console.log("Xóa tệp tin thành công.");
    return true;
  } catch (error) {
    console.error("Lỗi khi xóa tệp tin:", error);
    return false;
  }
};
