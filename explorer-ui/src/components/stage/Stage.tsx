import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function Stage({
                   children,
                   label,
               }: React.PropsWithChildren<{ label: string }>) {
    const classes = classNames("euiComponent", "content-stage");

    return (
        <div className={classes}>
            Content Window Panel<br/>
            RenderTime : {Date.now()}
        </div>
    );
}

Stage.propTypes = {
    className: PropTypes.string
};

export default React.memo(Stage);