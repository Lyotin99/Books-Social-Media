import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
interface btnDetails {
  btnClassName?: string;
  tipClassName?: string;
  tip?: string;
  children?: any;
  onClick?: () => void;
}

const myBtn = ({
  children,
  onClick,
  tip,
  btnClassName,
  tipClassName,
}: btnDetails) => {
  return (
    <div>
      <Tooltip title={tip ? tip : ""} className={tipClassName}>
        <IconButton onClick={onClick} className={btnClassName}>
          {children}
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default myBtn;
