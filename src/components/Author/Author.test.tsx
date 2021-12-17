import React from "react";
import { render, screen } from "@testing-library/react";
import { Author } from ".";

const user = {
  firstName: "Firstname",
  lastName: "Lastname",
  avatar: "avatar.png",
};

const MOST_COMMON_TOPIC = "Most common topic";
const SECOND_MOST_COMMON_TOPIC = "Second most common topic";
const THIRD_MOST_COMMON_TOPIC = "Third most common topic";

test("displays the full user name", () => {
  render(<Author user={user} />);
  screen.getByText("Firstname Lastname");
});

test("includes the full name in the user image alt text", () => {
  render(<Author user={user} />);
  screen.getByAltText("Avatar for Firstname Lastname");
});

test("includes the user image in the avatar src", () => {
  render(<Author user={user} />);
  expect(screen.getByAltText("Avatar for Firstname Lastname")).toHaveAttribute(
    "src",
    user.avatar
  );
});

test("does not display favorite topics if no stats are provided", () => {
  render(<Author user={user} />);
  expect(screen.queryByText("Favorite topics:")).not.toBeInTheDocument();
});

test("does not display monthly stats if stats are not provided", () => {
  render(<Author user={user} />);
  expect(screen.queryByTestId("monthly-stats")).not.toBeInTheDocument();
});

test("does not display author interests chart if stats are not provided", () => {
  render(<Author user={user} />);
  expect(screen.queryByTestId("donut-chart")).not.toBeInTheDocument();
});

test("displays the top topics", () => {
  render(
    <Author
      user={user}
      favoriteTopics={[
        MOST_COMMON_TOPIC,
        SECOND_MOST_COMMON_TOPIC,
        THIRD_MOST_COMMON_TOPIC,
      ]}
    />
  );
  screen.getByText("Favorite topics:");
  screen.getByText(
    `${MOST_COMMON_TOPIC}, ${SECOND_MOST_COMMON_TOPIC}, ${THIRD_MOST_COMMON_TOPIC}`
  );
});

test("displays the chart element when provided", () => {
  render(<Author user={user} charts={() => <div data-testid="xy-chart" />} />);
  screen.getByTestId("xy-chart");
});
