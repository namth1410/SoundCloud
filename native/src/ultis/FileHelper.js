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
import { postSongFromUserAsync } from "../redux/songSlice";

// const save = async (uri, filename, mimetype) => {
//   if (Platform.OS === "android") {
//     const permissions =
//       await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
//     if (permissions.granted) {
//       const base64 = await FileSystem.readAsStringAsync(uri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });
//       await FileSystem.StorageAccessFramework.createFileAsync(
//         permissions.directoryUri,
//         filename,
//         mimetype
//       )
//         .then(async (uri) => {
//           await FileSystem.writeAsStringAsync(uri, base64, {
//             encoding: FileSystem.EncodingType.Base64,
//           });
//         })
//         .catch((e) => console.log(e));
//     } else {
//       shareAsync(uri);
//     }
//   } else {
//     shareAsync(uri);
//   }
// };

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

  // if (permissions.type === "success") {
  //   // Lưu thông tin tệp và tùy chọn vào trạng thái ứng dụng
  //   const selectedFile = permissions;
  //   // Hiển thị giao diện để cài đặt tùy chọn

  //   // Khi người dùng chọn "Tải lên" sau khi cài đặt tùy chọn
  //   const uploadResult = await uploadFileToFirebase(selectedFile, customOptions);
  //   if (uploadResult) {
  //     // Xử lý khi tải lên thành công
  //   } else {
  //     // Xử lý khi có lỗi khi tải lên
  //   }
  // }
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

export const uploadFileToFirebase = async () => {
  if (Platform.OS === "android") {
    try {
      const permissions = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
      });
      if (permissions.type !== "success") {
        const { uri, name } = permissions;
        console.log(`File URI: ${permissions.assets[0].uri}`);
        console.log(`File Name: ${permissions.assets[0].name}`);

        const storageRef = ref(storage, `Stuff/${permissions.assets[0].name}`);
        const response = await fetch(permissions.assets[0].uri);
        const blob = await response.blob();

        const snapshot = uploadBytesResumable(storageRef, blob, {
          contentType: "audio/mpeg", // Ví dụ: "audio/mpeg" cho file MP3
        });

        const trackUploadProgress = async () => {
          return new Promise((resolve) => {
            snapshot.on("state_changed", (taskSnapshot) => {
              const progress =
                (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
              console.log(`Progress: ${progress}%`);
              if (taskSnapshot.bytesTransferred === taskSnapshot.totalBytes) {
                const _storageRef = ref(
                  storage,
                  `Stuff/${permissions.assets[0].name}`
                );
                setTimeout(() => {
                  getDownloadURL(_storageRef)
                    .then((url) => {
                      console.log("URL của tệp:", url);
                      // Ở đây, bạn có thể sử dụng biến `url` để thực hiện công việc cần thiết với URL của tệp.
                    })
                    .catch((error) => {
                      console.error("Lỗi khi lấy URL:", error);
                    });
                }, 2000);
              }
              if (taskSnapshot.state === "success") {
                resolve();
              }
            });
          });
        };

        // Đợi đến khi tải lên hoàn thành
        await trackUploadProgress();

        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log(`File available at: ${downloadURL}`);
        return downloadURL;
      } else {
        console.log("User canceled document picker.");
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi tải lên tệp:", error);
      return null;
    }
    // const permissions =
    //   await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    // if (permissions.granted) {
    //   try {
    //     let result = await DocumentPicker.getDocumentAsync({});
    //     // console.log(result.uri);
    //     console.log(result);
    //     const storageRef = ref(storage, "Stuff/" + new Date().getTime());
    //     const snapshot = await uploadBytesResumable(storageRef);

    //     const downloadURL = await snapshot.ref.getDownloadURL();
    //     console.log(downloadURL);
    //     return downloadURL;
    //   } catch (error) {
    //     console.error("Lỗi khi tải lên tệp:", error);
    //     return null;
    //   }
    // } else {
    //   // Xử lý khi không có quyền truy cập
    // }
  } else {
    // Xử lý trên các nền tảng khác
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

      console.log(audioDownloadURL);
      console.log(imageDownloadURL);

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
              dispatch(deleteFile(item));
              setTimeout(() => {
                getDownloadURL(_storageRef)
                  .then((url) => {
                    console.log("URL của tệp:", url);
                    console.log(item);
                    console.log(imageDownloadURL);
                    resolve(url);
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

export const deleteFileToFirebase = async (fileLocation) => {
  try {
    const storageRef = ref(storage, "Stuff/Nhạc hay (1).wav");

    // Xóa tệp tin trên Firebase Storage
    await deleteObject(storageRef);

    // Xóa thành công
    console.log("Xóa tệp tin thành công.");
    return true;
  } catch (error) {
    console.error("Lỗi khi xóa tệp tin:", error);
    return false;
  }
};
