//
//------------------------------------------------------------------------
// 屬性	        說明	           類型	                          默認值
//------------------------------------------------------------------------
// variant	    設置按鈕類型	    contained, outlined, text
// themeColor	  設置按鈕的顏色	  primary, secondary, 色票	     pirmary
// startIcon	  設置按鈕左方圖示	node
// endIcon      設置按鈕右方圖示	node
// isLoading    載入中狀態       boolean	                      false
// isDisabled   禁用狀態         boolean	                      false
// children     按鈕的內容	     node
//------------------------------------------------------------------------
//

import React from "react";
import styled, { css } from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import { defaultTheme } from "@/contexts/theme";

const containedStyle = css`
  background: ${props => props.$themeColor};
  color: #fff;
`;

const outlinedStyle = css`
  background: #fff;
  color: ${props => props.$themeColor};
  border: 1px solid ${props => props.$themeColor};
  &:hover {
    background: ${props => `${props.$themeColor}10`};
  }
`;

const textStyle = css`
  min-width: 50px;
  background: #fff;
  color: ${props => props.$themeColor};
  &:hover {
    background: ${props => `${props.$themeColor}90`};
    color: #fff;
  }
`;
const variantMap = {
  contained: containedStyle,
  outlined: outlinedStyle,
  text: textStyle,
};

const disabledStyle = css`
  cursor: not-allowed !important;
  &:hover,
  &:active {
    opacity: 1;
  }
`;

const StartIcon = styled.span`
  margin-right: 8px;
`;

const EndIcon = styled.span`
  margin-left: 8px;
`;

const StyledCircularProgress = styled(CircularProgress)`
  margin-right: 8px;
  color: ${props =>
    props.$variant === "contained" ? "#FFF" : props.$color} !important;
`;

const StyledButton = styled.button`
  border: none;
  outline: none;
  min-width: 100px;
  height: 36px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s, border 0.2s,
    opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.6;
  }
  &:active {
    opacity: 0.7;
  }

  ${props => variantMap[props.$variant] || defaultTheme.color.primary}
  ${props => (props.$isDisabled ? disabledStyle : null)}
`;

export default class button extends React.Component<any, Props> {
  constructor(props) {
    super(props);
    this.state = {
      themeColor: "",
      variant: "contained",
      children: "",
      isDisabled: false,
      onClick: () => {},
      ...props,
    };
  }

  componentDidMount() {
    this.useColor(this.props.themeColor, this.props.isDisabled);
  }

  useColor(themeColor: string, isDisabled: boolean) {
    const colorRegex = new RegExp(
      /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^)]*\)/
    );
    const isValidColorCode = colorRegex.test(themeColor?.toLocaleLowerCase());
    const madeColor = isValidColorCode
      ? themeColor
      : defaultTheme.color[themeColor] || defaultTheme.color.primary;
    let res = isDisabled ? defaultTheme.color.disable : madeColor;
    this.setState({ themeColor: res });
  }

  render() {
    const {
      name,
      className,
      themeColor,
      variant,
      radius,
      children,
      isLoading,
      isDisabled,
      startIcon,
      endIcon,
      width,
      onClick,
    } = this.state;

    return (
      <StyledButton
        type="button"
        className={className}
        name={name}
        $themeColor={themeColor}
        $variant={variant}
        $isDisabled={isDisabled}
        onClick={isDisabled ? null : onClick}
        style={{
          borderRadius: radius,
          width: width,
        }}
        {...this.props}
      >
        {isLoading && (
          <StyledCircularProgress
            $variant={variant}
            $color={
              defaultTheme.color[themeColor] || defaultTheme.color.primary
            }
            size={16}
          />
        )}
        {startIcon && <StartIcon>{startIcon}</StartIcon>}
        <span>{children}</span>
        {endIcon && <EndIcon>{endIcon}</EndIcon>}
      </StyledButton>
    );
  }
}

interface Props {
  className?: string;
  name?: string;
  variant?: "contained" | "outlined" | string;
  themeColor?: string;
  radius?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  startIcon?: any;
  endIcon?: any;
  width?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}
