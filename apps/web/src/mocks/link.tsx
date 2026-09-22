// mocks/next/link.js
import React from "react";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const Link = ({ href, children, ...props }: LinkProps) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

export default Link;
