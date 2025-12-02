import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../App";
import CarList from "../CarList";
import CarDetails from "../CarDetails";
import CarForm from "../CarForm";
import NotFound from "../NotFound";


const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            { path: 'cars', element: <CarList /> },
            { path: 'cars/:id', element: <CarDetails /> },
            { path: 'edit/:id', element: <CarForm /> },
            { path: 'not-found', element: <NotFound /> },
            { path: '*', element: <Navigate replace to='/not-found' /> }
        ]
    }
]

export const router = createBrowserRouter(routes);