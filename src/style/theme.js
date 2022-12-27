import styled from "styled-components";
import { Link } from "react-router-dom";
export const theme = {
  colors: {
    black: "#000000",
    white: "#ffffff",
    blue: "#4000ff",
    navy: "#3200c9",
    green: "#61ff00",
    gray: "#868686",
    whiteGray: "#F5F2FF",
    mediumBlue: "#7243FF",
    purple: "#AB91F8",
    navy: "#7243FF",
    mediumSlateBlue: "#AA90F8",
    plum: "#B59CFF",
    mediumGray: "#f0f0f0",
    semiWhite: "#f9f9f9",
    mediumPurple: "#F3EEFF",
    lightGray: "#BDBDBD",
  },
};
export const StyledLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;
