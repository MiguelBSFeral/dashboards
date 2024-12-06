import Device from './device';

type Data = {
    id: number;
    deviceId: number;
    eco2?: number;
    tvoc?: number;
    red?: number;
    blue?: number;
    green?: number;
    lux?: number;
    lightTempRaw?: number;
    temp?: number;
    humidity?: number;
    r?: number;
    g?: number;
    b?: number;
    ir?: number;
    lightTemp?: number;
    dbmax?: number;
    dbavg?: number;
    dbmin?: number;
    pressure?: number;
    ptemp?: number;
    devicesCount?: number;
    devicesFlow?: number;
    temperature?: number;
    ssid?: string;
    rssi?: number;
    ssidAlt?: string;
    rssiAlt?: number;
    connectedToAlt?: boolean;
    windSpeed?: number;
    createdAt?: Date;
    deviceName?: string;
    device?: Device;
};

export default Data;
