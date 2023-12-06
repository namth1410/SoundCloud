export const convertTimeToString = (createdAt) => {
  const currentTime = new Date();
  const createdTime = new Date(createdAt);
  const timeDiff = currentTime - createdTime;
  let timeAgoString = "";

  if (timeDiff < 60000) {
    // less than a minute
    timeAgoString = "Just now";
  } else if (timeDiff < 3600000) {
    // less than an hour
    const minutes = Math.floor(timeDiff / 60000);
    timeAgoString = `${minutes} phút trước`;
  } else if (timeDiff < 86400000) {
    // less than a day
    const hours = Math.floor(timeDiff / 3600000);
    timeAgoString = `${hours} giờ trước`;
  } else if (timeDiff < 2592000000) {
    // less than a month (30 days)
    const days = Math.floor(timeDiff / 86400000);
    timeAgoString = `${days} ngày trước`;
  } else if (timeDiff < 31536000000) {
    // less than a year
    const months = Math.floor(timeDiff / 2592000000);
    timeAgoString = `${months} tháng trước`;
  } else {
    const years = Math.floor(timeDiff / 31536000000);
    timeAgoString = `${years} năm trước`;
  }
  return timeAgoString;
};

export const convertNumberToString = (number) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number.toString();
  }
};

export const convertTimeTrackToString = (timeInMs) => {
  const totalSeconds = Math.floor(timeInMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatDigit = (value) => (value < 10 ? `0${value}` : `${value}`);
  if (hours > 0) {
    return `${formatDigit(hours)}:${formatDigit(minutes)}:${formatDigit(
      seconds
    )}`;
  } else {
    return `${formatDigit(minutes)}:${formatDigit(seconds)}`;
  }
};
