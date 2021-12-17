import { gql } from '@apollo/client';

export const ALL_POSTS = gql`
    query GetAllPosts($count: Int) {
        allPosts(count: $count) {
            id
            title
            body
            published
            createdAt
            author {
                id
                firstName
                lastName
                email
                avatar
            }
            likelyTopics {
                label
                likelihood
            }
        }
    }
`;
