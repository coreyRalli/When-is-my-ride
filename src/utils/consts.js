import iconTrain from '../assets/transport_icon_train.svg';
import iconBus from '../assets/transport_icon_bus.svg';
import iconTram from '../assets/transport_icon_tram.svg';
import iconVline from '../assets/transport_icon_vline.svg';

export const TRANSPORT_ICONS = [iconTrain, iconTram, iconBus, iconVline];
export const TRANSPORT_TYPES = ['Train', 'Tram', 'Bus', 'VLine'];
export const TRANSPORT_TYPE_IDS = {
    train: 0,
    tram: 1,
    bus: 2,
    vline: 3
}

export const API_BASE_URL = "https://when-is-my-ride-server.herokuapp.com/";
export const API_AUTH_TOKEN = "starburstsandmountaindew";

export const formatTime = (date) => {
    const convertedDate = new Date(date);

    const hrs = convertedDate.getHours().toString().padStart(2, '0');
    const mins = convertedDate.getMinutes().toString().padStart(2, '0');

    return `${hrs}:${mins}`;
}

export const formatDate = (date) => {
    const convertedDate = new Date(date);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thusday', 'Friday', 'Saturday'];
    const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const dayName = days[convertedDate.getDay()];
    const monthName = months[convertedDate.getMonth()];

    return `${dayName} ${convertedDate.getDate()} ${monthName}`;
}