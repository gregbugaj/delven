import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export const ContentWindow = ({children, className, ...rest}) => {
    const classes = classNames("euiComponent", className);

    return (
        <div className={classes} {...rest}>

            Content Window Panel<br/>
            RenderType : {Date.now()}
        </div>
    );
};

ContentWindow.propTypes = {
    className: PropTypes.string
};
