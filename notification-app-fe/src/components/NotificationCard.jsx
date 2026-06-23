import {
  Card,
  CardContent,
  Typography,
  Chip,
} from "@mui/material";

export function NotificationCard({
  notification,
}) {
  const viewed =
    JSON.parse(
      localStorage.getItem("viewed") || "[]"
    ).includes(notification.ID);

  const markAsViewed = () => {
    const old =
      JSON.parse(
        localStorage.getItem("viewed") || "[]"
      );

    if (!old.includes(notification.ID)) {
      localStorage.setItem(
        "viewed",
        JSON.stringify([
          ...old,
          notification.ID,
        ])
      );
    }

    window.location.reload();
  };

  return (
    <Card
      onClick={markAsViewed}
      sx={{
        cursor: "pointer",
        border: viewed
          ? "1px solid #ddd"
          : "2px solid #1976d2",
      }}
    >
      <CardContent>
        <Chip
          label={
            viewed ? "Read" : "Unread"
          }
          color={
            viewed
              ? "default"
              : "primary"
          }
          size="small"
        />

        <Typography mt={1}>
          {notification.Message}
        </Typography>

        <Typography
          variant="caption"
        >
          {notification.Timestamp}
        </Typography>
      </CardContent>
    </Card>
  );
}