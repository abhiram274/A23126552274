import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

import { NotificationCard } from "../components/NotificationCard";
import { useNotifications } from "../hooks/useNotifications";

export default function PriorityInbox() {
  const [topN, setTopN] = useState(10);

  const {
    notifications,
    loading,
    error,
  } = useNotifications(1, "All");

  const priorityNotifications = useMemo(() => {
    const weights = {
      Placement: 3,
      Result: 2,
      Event: 1,
    };

    return [...notifications]
      .sort((a, b) => {
        const scoreA =
          (weights[a.Type] || 0) * 1000000 +
          new Date(a.Timestamp).getTime();

        const scoreB =
          (weights[b.Type] || 0) * 1000000 +
          new Date(b.Timestamp).getTime();

        return scoreB - scoreA;
      })
      .slice(0, topN);
  }, [notifications, topN]);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Priority Inbox
      </Typography>

      <Select
        value={topN}
        onChange={(e) =>
          setTopN(Number(e.target.value))
        }
      >
        <MenuItem value={10}>Top 10</MenuItem>
        <MenuItem value={15}>Top 15</MenuItem>
        <MenuItem value={20}>Top 20</MenuItem>
      </Select>

      <Stack spacing={2} mt={2}>
        {priorityNotifications.map((n) => (
          <NotificationCard
            key={n.ID}
            notification={n}
          />
        ))}
      </Stack>
    </Box>
  );
}