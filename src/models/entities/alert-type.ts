type AlertType = {
    id: string;
    number?: number;
    name: string;
    description?: string;
    color: string;
    criticality: string;
    createdAt?: Date;
    modifiedAt?: Date;
    groupId?: string;
};

export default AlertType;
