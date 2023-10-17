import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { ToastAndroid } from "react-native";
import { storage } from "../api/firebase";
export const downloadFromUrl = async (infoSong) => {
  const downloadedSongs = await AsyncStorage.getItem("downloadedSongs");
  let downloadedSongsArray = [];
  if (downloadedSongs) {
    downloadedSongsArray = JSON.parse(downloadedSongs);
  }
  const isSongAlreadyDownloaded = downloadedSongsArray.some(
    (song) => song.linkSong === infoSong.linkSong
  );

  if (!isSongAlreadyDownloaded) {
    const downloadResumable = FileSystem.createDownloadResumable(
      infoSong.linkSong,
      FileSystem.documentDirectory + infoSong.nameSong,
      {},
      (downloadProgress) => {
        const progress =
          downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite;
        console.log(`${progress * 100}%`);
      }
    );

    try {
      const result = await downloadResumable.downloadAsync();

      const downloadedSongs = await getDownloadedSongs(); // Sử dụng await ở đây

      downloadedSongs.push({
        ...infoSong,
        urlLocal: result.uri,
        timestamp: new Date().getTime(),
      });

      await saveDownloadedSongs(downloadedSongs);

      ToastAndroid.show(`Download done`, ToastAndroid.SHORT);
    } catch (e) {
      console.error("Lỗi tải xuống:", e);
    }
  } else {
    console.log(`Bài hát "${infoSong.nameSong}" đã được tải xuống trước đó.`);
  }
};

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

// Hàm để lưu danh sách bài hát đã tải về
const saveDownloadedSongs = async (songs) => {
  try {
    await AsyncStorage.setItem("downloadedSongs", JSON.stringify(songs));
  } catch (error) {
    console.error("Lỗi khi lưu danh sách bài hát đã tải về:", error);
  }
};

// Hàm để lấy danh sách bài hát đã tải về
const getDownloadedSongs = async () => {
  try {
    const value = await AsyncStorage.getItem("downloadedSongs");
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài hát đã tải về:", error);
    return [];
  }
};

export const removeSong = async (songToDelete) => {
  try {
    // Bước 1: Lấy danh sách bài hát đã tải về từ AsyncStorage
    const downloadedSongs = await getDownloadedSongs();

    // Bước 2: Tìm và xóa bài hát cụ thể khỏi danh sách
    const updatedSongs = downloadedSongs.filter(
      (song) => song.linkSong !== songToDelete.linkSong
    );

    // Bước 3: Lưu danh sách bài hát đã cập nhật lại vào AsyncStorage
    await saveDownloadedSongs(updatedSongs);

    ToastAndroid.show(`Xóa thành công`, ToastAndroid.SHORT);

    // Trả về danh sách bài hát đã cập nhật (tùy theo yêu cầu của bạn)
    return updatedSongs;
  } catch (error) {
    console.error("Lỗi khi xóa bài hát đã tải về:", error);
    return null;
  }
};
