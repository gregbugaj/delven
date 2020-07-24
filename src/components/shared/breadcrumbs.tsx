import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography'
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

// Customization
import { AdapterLink } from "../utils/NavLinkMui";

// https://stackoverflow.com/questions/37282159/default-property-value-in-react-component-using-typescript
// https://medium.com/@martin_hotell/react-typescript-and-defaultprops-dilemma-ca7f81c661c7

interface ComponentProps {
  label?: string,
  breadcrumbs:{[key:string]:string}, 
}

class BreadcrumModule extends Component<ComponentProps, {}> {

  public static defaultProps = {
    label: "default-label",
    breadcrumbs:{}
  };

  constructor(props: any) {
    super(props);
  }
    
  render() { 
   const breadcrumbNameMap = this.props.breadcrumbs;
   const handleClick = (event: any) => {
      // TODO : this need to be handled via router
      console.info('You clicked a breadcrumb.');
    };

    // eslint-disable-next-line no-restricted-globals
    const pathnames = location.pathname.split('/').filter(x => x);
    console.info(`paths : ${pathnames}`);
    return (
          <Breadcrumbs  color="inherit" aria-label="breadcrumb">
            <Link color="inherit" href="/" onClick={handleClick}>
              Modules
            </Link>
            {pathnames.map((value, index)=>{
                console.info(`Val / Index = ${value}, ${index}`)
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                return last ? (
                  <Typography color="textPrimary" key={to}>
                    {breadcrumbNameMap[to]}
                  </Typography>
                ) : (
                  <Link component={AdapterLink} color="inherit" to={to} key={to}>
                  {breadcrumbNameMap[to]}
                </Link>
                );
            })};
          </Breadcrumbs>
      );
  }
}

export default BreadcrumModule; 