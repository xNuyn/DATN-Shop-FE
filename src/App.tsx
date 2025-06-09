import RouteComponent from "./routes/routes"
import "./app.scss";
import { BillingProvider } from "./utils/BillingContext"

function App() {
    const routeElement = RouteComponent();

    return (
        <BillingProvider>
            <div>
             {routeElement}
            </div>
        </BillingProvider>
    );
}

export default App;
