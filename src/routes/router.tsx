import {createBrowserRouter} from "react-router-dom";
import DashboardV1 from '../components/pages/DashboardV1';
import DashboardV2 from '../components/pages/DashboardV2';
import DashboardV3 from '../components/pages/DashboardV3';
import paths from "./paths";
import DashboardLayout from "../components/layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
    {
        element: <PrivateRoute/>,
        children: [
            {
                element: <DashboardLayout/>,
                children: [
                    {path: '*', element: <DashboardV3/>},
                    {path: '/', element: <DashboardV3/>},
                    {path: paths.dashboardV1, element: <DashboardV1/>},
                    {path: paths.dashboardV2, element: <DashboardV2/>},
                    {path: paths.dashboardV3, element: <DashboardV3/>}
                ],
            }
        ],
    }
]);

export default router;
