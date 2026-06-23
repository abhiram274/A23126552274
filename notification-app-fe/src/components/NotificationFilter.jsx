import {
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";

const filters = [
  "All",
  "Placement",
  "Result",
  "Event"
];

export function NotificationFilter({
  value,
  onChange
}) {

  return (

    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, value) => {
        if (value) onChange(value);
      }}
      size="small"
    >

      {filters.map(type => (

        <ToggleButton
          key={type}
          value={type}
        >
          {type}
        </ToggleButton>

      ))}

    </ToggleButtonGroup>

  );
}