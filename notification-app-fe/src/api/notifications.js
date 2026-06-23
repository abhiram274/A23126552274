// const BASE_URL =
//   "/api/evaluation-service/notifications";

const BASE_URL =
"http://localhost:5000/notifications";

const TOKEN = "YOUR_Bearer_TOKEN";

export async function fetchNotifications(
  page = 1,
  limit = 10,
  notificationType = ""
) {
  let url =
    `${BASE_URL}?page=${page}&limit=${limit}`;

  if (
    notificationType &&
    notificationType !== "All"
  ) {
    url +=
      `&notification_type=${notificationType}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(
      `HTTP Error ${response.status}`
    );
  }

  return response.json();
}