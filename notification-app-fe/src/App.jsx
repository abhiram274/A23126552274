import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import { NotificationsPage }
from "./pages/NotificationsPage";

import PriorityInbox
from "./pages/PriorityInbox";

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          padding: "20px",
          display: "flex",
          gap: "20px",
        }}
      >
        <Link to="/">
          Notifications
        </Link>

        <Link to="/priority">
          Priority Inbox
        </Link>
      </div>

      <Routes>
        <Route
          path="/"
          element={<NotificationsPage />}
        />

        <Route
          path="/priority"
          element={<PriorityInbox />}
        />
      </Routes>
    </BrowserRouter>
  );
}