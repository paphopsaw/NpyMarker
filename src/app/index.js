import View from "./View"
import Controller from "./Controller";

const app = document.getElementById("App");
View.init(app);
const controller = new Controller(View);