import styled from 'styled-components';

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
  gap: 1rem;
`;

export const AuthorsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const AllPostsWrapper = styled.div`
  flex: 1;
  @media (max-width: 1024px) {
    position: relative;
  }
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
