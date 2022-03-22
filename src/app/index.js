import view from "./View"
import Controller from "./Controller";
import state from "./AppState";

const app = document.getElementById("App");
view.init(app);
const controller = new Controller(view, state);