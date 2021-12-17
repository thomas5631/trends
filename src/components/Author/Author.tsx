import React from "react";
import { Avatar } from "../Avatar";
import {
  AuthorContents,
  AuthorWrapper,
  AvatarWrapper,
  CardContent,
} from "./Author.styled";

interface AuthorProps {
  user: {
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  favoriteTopics?: string[];
  charts?: () => React.ReactElement;
}

export const Author = ({
  user,
  charts,
  favoriteTopics,
}: AuthorProps) => {
  const fullName = React.useMemo(() => {
    return `${user.firstName} ${user.lastName}`;
  }, [user]);

  return (
    <div>
      <CardContent>
        <AuthorWrapper>
          <AuthorContents>
            <AvatarWrapper>
              <Avatar
                src={user.avatar || undefined}
                alt={`Avatar for ${fullName}`}
                width={120}
                height={120}
              />
            </AvatarWrapper>
            <b>{fullName}</b>
          </AuthorContents>
        </AuthorWrapper>
        {charts && charts()}
      </CardContent>
      {favoriteTopics && favoriteTopics.length > 0 && (
        <div>
          <span>Favorite topics: </span>
          <em>{favoriteTopics.map((topic) => topic).join(", ")}</em>
        </div>
      )}
    </div>
  );
};
