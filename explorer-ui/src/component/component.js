import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export const EuiComponent = ({ children, className, ...rest }) => {
  const classes = classNames("euiComponent", className);

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

EuiComponent.propTypes = {
  className: PropTypes.string
};
