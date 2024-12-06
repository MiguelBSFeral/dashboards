import AlertType from './alert-type';

type AlertCondition = {
    id: string;
    number?: number;
    alertTypeId: string;
    operator?: string;
    value: number;
    metric: string;
    createdAt?: Date;
    modifiedAt?: Date;
    alertType?: AlertType;
};

export default AlertCondition;
