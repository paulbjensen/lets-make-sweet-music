import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";

import * as Sentry from "@sentry/svelte";

// Initialize Sentry
const sentryDSN =
	"https://fc0c7f164bdc3e05e84de2ae8efc439d@o95413.ingest.us.sentry.io/4509112877252608";
Sentry.init({ dsn: sentryDSN });

const appElement: HTMLElement | null = document.getElementById("app");

if (!appElement) {
	throw new Error("No app element found in the DOM");
}

const app = mount(App, { target: appElement });

export default app;
