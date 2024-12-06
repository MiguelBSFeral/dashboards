import Data from './data';
import AlertType from './alert-type';
import AlertCondition from './alert-condition';

type Alert = {
    id: string;
    number: number;
    alertTypeId: string;
    dataId: number;
    // dataId: string;
    notifiedAt?: Date;
    value: number;
    createdAt: Date;
    modifiedAt: Date;
    alertType?: AlertType;
    alertCondition?: AlertCondition;
    data?: Data;
}

export default Alert;
