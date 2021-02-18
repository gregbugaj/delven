
import React from "react"
import { LinkProps, NavLink } from 'react-router-dom';
import { BrowserRouter as Router, Route, Link, withRouter} from "react-router-dom"

// https://github.com/mui-org/material-ui/issues/7956#issuecomment-326908167

// The usage of React.forwardRef will no longer be required for react-router-dom v6.
// see https://github.com/ReactTraining/react-router/issues/6056
export const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (    
    <Link innerRef={ref as any} {...props} />
));


