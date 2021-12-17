import React from "react";
import { render, screen } from "@testing-library/react";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { App } from "./App";
import { ALL_POSTS } from "./App.query";
import { GraphQLError } from "graphql";

const setup = ({ mocks }: { mocks: MockedResponse[] }) => {
  return render(
    <MockedProvider mocks={mocks}>
      <App />
    </MockedProvider>
  );
};

const failureMock: MockedResponse = {
  request: {
    query: ALL_POSTS,
    variables: {
      count: 1000,
    },
  },
  result: {
    errors: [new GraphQLError("There was a problem!")],
  },
};

const mockUser1 = {
  firstName: "Dixie",
  lastName: "Blanda",
};

const mockUser2 = {
  firstName: "Tommy",
  lastName: "Clarke",
};

const successMock: MockedResponse = {
  request: {
    query: ALL_POSTS,
    variables: {
      count: 1000,
    },
  },
  result: {
    data: {
      allPosts: [
        {
          id: "ckxkncu3e0d6g5510s08n9km3",
          title: "Associate feed payment",
          body: "Repellendus quis velit veritatis quia laudantium maxime porro est quasi. Sed error aut enim molestias suscipit et facere accusamus. Voluptatem nihil quibusdam quis quibusdam. Quia et magni fuga deserunt. Harum at qui et quasi ut hic nostrum aut.\n \rAut voluptatibus est ut est. Error voluptatibus exercitationem aliquam voluptatum. Maiores quidem et accusamus sapiente facere beatae praesentium. Et quisquam excepturi accusantium consequatur et numquam mollitia. Et perferendis amet quis.\n \rA asperiores mollitia laborum minima omnis quisquam. Est sint iure ut cumque et et blanditiis illo illum. Vitae fugiat molestias odio quaerat commodi dolorem accusantium et pariatur.",
          published: false,
          createdAt: "1570899869969",
          author: {
            ...mockUser1,
            id: "ckxkg2uww00005510an33g9cj",
            email: "Magnolia49@yahoo.com",
            avatar:
              "https://s3.amazonaws.com/uifaces/faces/twitter/strikewan/128.jpg",
            __typename: "User",
          },
          likelyTopics: [
            {
              label: "birthday",
              likelihood: 0.26611783553145624,
              __typename: "Topic",
            },
            {
              label: "community",
              likelihood: 0.1778934256827657,
              __typename: "Topic",
            },
            {
              label: "shopping",
              likelihood: 0.16324997276621128,
              __typename: "Topic",
            },
            {
              label: "celebrity",
              likelihood: 0.12715870493558218,
              __typename: "Topic",
            },
            {
              label: "fishing",
              likelihood: 0.09911925145502144,
              __typename: "Topic",
            },
            {
              label: "potato",
              likelihood: 0.07234491927874935,
              __typename: "Topic",
            },
            {
              label: "management",
              likelihood: 0.04376056497860384,
              __typename: "Topic",
            },
            {
              label: "wedding",
              likelihood: 0.04031284851812296,
              __typename: "Topic",
            },
            {
              label: "security",
              likelihood: 0.005396182540287273,
              __typename: "Topic",
            },
            {
              label: "sport",
              likelihood: 0.004646294313199766,
              __typename: "Topic",
            },
          ],
          __typename: "Post",
        },
        {
          id: "ckxkncu3f0d6m55107v8s45vm",
          title: "e-business microchip",
          body: "Adipisci dolorem ducimus eligendi. Eaque culpa deserunt perferendis et eum occaecati odio tenetur eum. Quisquam iure voluptatum vel itaque. Quia sequi est id corporis officiis molestias repellat optio.\n \rLabore autem et natus eum voluptatum quia ex et. Ex minus saepe ad itaque nobis aperiam harum placeat qui. Aut iure harum odio adipisci. Rerum aliquam dolores sint culpa quod. Inventore voluptas a non velit delectus.\n \rLaudantium rerum quia. Quo quisquam ut et. Odio qui voluptatem occaecati tempore. Qui porro temporibus eius veniam placeat fugiat. Voluptatem et illo et voluptatem voluptas. Et magnam repellat labore.",
          published: false,
          createdAt: "1547921630669",
          author: {
            ...mockUser2,
            id: "ckxkg2uww00005510an33g9cx",
            email: "Magnolia9@yahoo.com",
            avatar:
              "https://s3.amazonaws.com/uifaces/faces/twitter/strikewan/128.jpg",
            __typename: "User",
          },
          likelyTopics: [
            {
              label: "celebrity",
              likelihood: 0.23307015749524698,
              __typename: "Topic",
            },
            {
              label: "community",
              likelihood: 0.2292980921944986,
              __typename: "Topic",
            },
            {
              label: "fishing",
              likelihood: 0.22621502288985307,
              __typename: "Topic",
            },
            {
              label: "potato",
              likelihood: 0.1449800606643733,
              __typename: "Topic",
            },
            {
              label: "shopping",
              likelihood: 0.08118594928525483,
              __typename: "Topic",
            },
            {
              label: "wedding",
              likelihood: 0.026813287187567102,
              __typename: "Topic",
            },
            {
              label: "sport",
              likelihood: 0.024363595860170232,
              __typename: "Topic",
            },
            {
              label: "birthday",
              likelihood: 0.023756235530528604,
              __typename: "Topic",
            },
            {
              label: "management",
              likelihood: 0.008475209258871682,
              __typename: "Topic",
            },
            {
              label: "security",
              likelihood: 0.0018423896336357947,
              __typename: "Topic",
            },
          ],
          __typename: "Post",
        },
      ],
    },
  },
};

test("renders loading when query is executing", () => {
  setup({ mocks: [] });
  screen.getByText("Loading...");
});

test("renders error when query fails", async () => {
  setup({
    mocks: [failureMock],
  });
  await screen.findByText("There was an error loading the data.");
});

describe("when the query succeeds", () => {
  test("renders title", async () => {
    setup({ mocks: [successMock] });
    await screen.findByText("User Posting Trends");
  });

  test("renders prompt to user", async () => {
    setup({ mocks: [successMock] });
    await screen.findByText(
      "Click a topic on the combined area graph to focus"
    );
  });

  test("renders an individual summary for each user", async () => {
    setup({
      mocks: [successMock],
    });
    await screen.findByText(`${mockUser1.firstName} ${mockUser1.lastName}`);
    await screen.findByText(`${mockUser2.firstName} ${mockUser2.lastName}`);
  });

  test("renders a combined chart for all topics", async () => {
    setup({
      mocks: [successMock],
    });
    await screen.findByTestId("all-posts");
  });
});
