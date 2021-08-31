import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';


export const useStylesSidePanel = makeStyles((theme: Theme) => createStyles({
  root: {
    width: '100%',
    height: "100%",
    // border:"1px solid red"
    padding: "0px"
  },
  item: {
    // border:"1px solid red"
    padding: "2px",
    backgroundColor: "#F5F5F5",
  },
  heading: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
    color: '#000',
    textTransform: "uppercase"
  },
  details: {
    backgroundColor: '',
    padding: '2px',
  },
}));
