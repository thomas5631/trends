import React from "react";
import { AvatarContainer } from "./Avatar.styled";

type AvatarProps = {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
};

const missingAvatarSrc = "missing_avatar.png";

export const Avatar = ({ src, alt, width = 100, height = 100 }: AvatarProps) => {
  const [avatarSrc, setAvatarSrc] = React.useState<string>(
    src || missingAvatarSrc
  );

  return (
    <AvatarContainer>
      <img
        src={avatarSrc}
        height={height}
        width={width}
        onError={() => {
          setAvatarSrc(missingAvatarSrc);
        }}
        alt={alt || "Avatar"}
      />
    </AvatarContainer>
  );
};
