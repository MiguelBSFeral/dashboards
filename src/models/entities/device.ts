import Company from './company';
import Data from './data';

type Device = {
    id: number;
    name?: string;
    serialNumber: string;
    mac: string;
    installationLocal?: string;
    groupId?: string;
    accessCodeId?: string;
    rssiThreshold?: number;
    packageId?: string;
    version?: string;
    createdAt?: Date;
    // auxiliary fields
    group?: Company;
    data?: Data;
};

export default Device;
