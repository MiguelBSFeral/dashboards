import React from 'react';
import './App.css';
import {RouterProvider} from 'react-router-dom';
import ThemeProvider from './themes';
import router from "./routes/router";


function App() {
    return (
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
