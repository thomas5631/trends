import { useQuery } from "@apollo/client";
import { maxBy } from "lodash";
import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { ALL_POSTS } from "./App.query";
import {
  GetAllPosts,
  GetAllPosts_allPosts,
  GetAllPosts_allPosts_author,
  GetAllPosts_allPosts_likelyTopics,
} from "./__generated__/GetAllPosts";
import { XYChart } from "./components/XYChart";
import { Author } from "./components/Author";
import { Card } from "./components/Card";
import { AuthorsWrapper, AllPostsWrapper, Content, Header } from "./App.styles";

const postTopic = (post: GetAllPosts_allPosts) => {
  const mostLikelyTopic = maxBy(
    (post.likelyTopics || []).filter(
      (topic): topic is GetAllPosts_allPosts_likelyTopics => Boolean(topic)
    ),
    (topic: GetAllPosts_allPosts_likelyTopics) => topic.likelihood
  );

  return mostLikelyTopic?.label || "NO PREVALENT TOPIC";
};

type EnrichedPost = GetAllPosts_allPosts & {
  creationMonth: Dayjs;
  topic: string;
};

interface MonthStats {
  month: Dayjs;
  count: number;
  topics: {
    [topic: string]: number;
  };
}

interface TopicStats {
  topic: string;
  count: number;
}

interface PostStats {
  byTopic: TopicStats[];
  byMonth: MonthStats[];
}

type UserPosts = {
  user: GetAllPosts_allPosts_author;
  posts: EnrichedPost[];
  stats: PostStats;
};

const extractStats = (posts: EnrichedPost[]) => {
  const postStats: PostStats = {
    byMonth: [],
    byTopic: [],
  };

  posts.forEach((post) => {
    const month = postStats.byMonth.find((stat) =>
      stat.month.isSame(post.creationMonth)
    );

    if (!month) {
      postStats.byMonth.push({
        month: post.creationMonth,
        count: 1,
        topics: {
          [post.topic]: 1,
        },
      });
    } else {
      month.count += 1;
      if (month.topics[post.topic]) {
        month.topics[post.topic] += 1;
      } else {
        month.topics[post.topic] = 1;
      }
    }

    const topic = postStats.byTopic.find((stat) => stat.topic === post.topic);

    if (!topic) {
      postStats.byTopic.push({
        topic: post.topic,
        count: 1,
      });
    } else {
      topic.count += 1;
    }
  });

  return {
    byMonth: postStats.byMonth.sort((month1, month2) =>
      month1.month.isAfter(month2.month) ? 1 : -1
    ),
    byTopic: postStats.byTopic.sort((topic1, topic2) =>
      topic1.topic < topic2.topic ? 1 : -1
    ),
  };
};

export const App = () => {
  const [postsByAuthor, setPostsByAuthor] = React.useState<UserPosts[]>([]);
  const [allPostStats, setAllPostStats] = React.useState<PostStats | null>(
    null
  );
  const [topics, setTopics] = React.useState<string[]>([]);
  const [allTopics, setAllTopics] = React.useState<string[]>([]);

  const { loading, error, data } = useQuery<GetAllPosts>(ALL_POSTS, {
    variables: { count: 1000 },
  });

  React.useEffect(() => {
    const postsPerUser = new Map<GetAllPosts_allPosts_author, EnrichedPost[]>();

    const posts = (data?.allPosts || [])
      .filter((post): post is GetAllPosts_allPosts => Boolean(post))
      .map((post) => ({
        ...post,
        topic: postTopic(post),
        creationMonth: dayjs(parseInt(post.createdAt, 10)).startOf("month"),
      }));

    setAllPostStats(extractStats(posts));
    setAllTopics([...new Set(posts.map((post) => post.topic))]);
    setTopics([...new Set(posts.map((post) => post.topic))]);

    posts.forEach((post) => {
      if (postsPerUser.has(post.author)) {
        postsPerUser.set(post.author, [
          ...(postsPerUser.get(post.author) || []),
          post,
        ]);
      } else {
        postsPerUser.set(post.author, [post]);
      }
    });

    const userPosts: UserPosts[] = [];

    for (const [author, authorPosts] of postsPerUser.entries()) {
      userPosts.push({
        user: author,
        posts: authorPosts,
        stats: extractStats(authorPosts),
      });
    }

    setPostsByAuthor(
      userPosts.sort(
        (entry1, entry2) => entry1.posts.length - entry2.posts.length
      )
    );
  }, [data?.allPosts]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>There was an error loading the data.</p>;

  return (
    <div>
      <Header>
        <h1>User Posting Trends</h1>
        <h2>
          {topics.length === 1 ? (
            <span>Current topic: {topics[0]}</span>
          ) : (
            <span>Click a topic on the combined area graph to focus</span>
          )}
        </h2>
      </Header>
      <Content>
        {allPostStats && (
          <AllPostsWrapper data-testid="all-posts">
            <Card>
              <XYChart
                groups={allPostStats.byMonth.map((item) => ({
                  date: item.month.format("MMM-YYYY"),
                  ...item.topics,
                }))}
                activeTopics={topics}
                setActiveTopic={(topic) =>
                  topics.length === 1
                    ? setTopics(allTopics)
                    : setTopics([topic])
                }
                xLabel="Month"
                yLabel={
                  topics.length !== 1 ? "Total Posts" : `${topics[0]} posts`
                }
              />
            </Card>
          </AllPostsWrapper>
        )}
        <AuthorsWrapper>
          {postsByAuthor &&
            postsByAuthor.map((entry) => (
              <Card key={entry.user.id}>
                <Author
                  user={entry.user}
                  charts={() => (
                    <XYChart
                      height={200}
                      groups={entry.stats.byMonth.map((item) => ({
                        date: item.month.format("MMM-YYYY"),
                        "Total posts": item.count.toString(),
                        ...item.topics,
                      }))}
                      activeTopics={
                        topics.length !== 1 ? ["Total posts"] : topics
                      }
                      xLabel="Month"
                      yLabel={
                        topics.length !== 1
                          ? "Total Posts"
                          : `${topics[0]} posts`
                      }
                    />
                  )}
                  favoriteTopics={entry.stats.byTopic
                    .sort((topic1, topic2) => topic2.count - topic1.count)
                    .map(({ topic }) => topic)
                    .slice(0, 3)}
                />
              </Card>
            ))}
        </AuthorsWrapper>
      </Content>
    </div>
  );
};
