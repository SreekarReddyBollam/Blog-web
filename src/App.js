import React from 'react';
import {
    BrowserRouter as Router,
    Route
} from "react-router-dom";
import Navigation from "./components/Navigation/navigation";

function App() {
    return (
        <Router>
            <Route component={Navigation}/>
        </Router>
    );
}

export default App;

