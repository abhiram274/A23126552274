// const BASE_URL =
//   "/api/evaluation-service/notifications";

const BASE_URL =
"http://localhost:5000/notifications";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrb3N1cnVhYmhpcmFtLjIzLmNzbUBhbml0cy5lZHUuaW4iLCJleHAiOjE3ODIxOTkxOTIsImlhdCI6MTc4MjE5ODI5MiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjIxNDY5OTFjLWYxN2ItNDM1Ny05MWNlLWExMTY0ZWMzODlkMyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFiaGlyYW0ga29zdXJ1Iiwic3ViIjoiMjcwOWU2ZjUtMmNmMy00MDZkLWFjZGEtYmE2YmU0NWViMGQ4In0sImVtYWlsIjoia29zdXJ1YWJoaXJhbS4yMy5jc21AYW5pdHMuZWR1LmluIiwibmFtZSI6ImFiaGlyYW0ga29zdXJ1Iiwicm9sbE5vIjoiYTIzMTI2NTUyMjc0IiwiYWNjZXNzQ29kZSI6Ik1UcXhhciIsImNsaWVudElEIjoiMjcwOWU2ZjUtMmNmMy00MDZkLWFjZGEtYmE2YmU0NWViMGQ4IiwiY2xpZW50U2VjcmV0IjoiemVrUGJQcEhoWHdOcFd6TiJ9.X6NpcEw-C2SS7d-p9p8NWrEj3X7K03omfIjfYcsOAM0";

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