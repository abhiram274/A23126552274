import { useState } from "react";

import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Typography
} from "@mui/material";

import NotificationsIcon
from "@mui/icons-material/Notifications";

import { NotificationCard }
from "../components/NotificationCard";

import { NotificationFilter }
from "../components/NotificationFilter";

import { useNotifications }
from "../hooks/useNotifications";

export function NotificationsPage() {

  const [filter, setFilter] =
    useState("All");

  const [page, setPage] =
    useState(1);

  const {
    notifications,
    totalPages,
    loading,
    error
  } =
    useNotifications(
      page,
      filter
    );

  return (

    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 3
      }}
    >

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
      >

        <Badge
          badgeContent={notifications.length}
          color="primary"
        >
          <NotificationsIcon />
        </Badge>

        <Typography variant="h5">
          Notifications
        </Typography>

      </Stack>

      <Divider sx={{ my: 3 }} />

      <NotificationFilter
        value={filter}
        onChange={setFilter}
      />

      {loading && (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {!loading &&
        notifications.length === 0 && (
          <Alert severity="info">
            No notifications found
          </Alert>
      )}

      <Stack spacing={2} mt={2}>

        {notifications.map(n => (

          <NotificationCard
            key={n.ID}
            notification={n}
          />

        ))}

      </Stack>

      {/* <Box
        display="flex"
        justifyContent="center"
        mt={3}
      > */}
<Box sx={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          page={page}
          count={totalPages}
          onChange={(_, value) =>
            setPage(value)
          }
        />

      </Box>

    </Box>

  );
}