import RouteComponent from "./routes/routes"
import "./app.scss";

function App() {
    const routeElement = RouteComponent();

    return (
        <div>
            {routeElement}
        </div>
    );
}

export default App;
