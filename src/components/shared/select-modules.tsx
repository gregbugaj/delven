import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Typography from '@material-ui/core/Typography'

import { fade, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },

    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(1),
          width: 'auto',
        },
      },
  }));
  

export const ModuleSelect = () => {
    const classes = useStyles();
    const handleChange = (event: Object) => {
        console.info("Selection : %s", event);
    };

    return(
        <div>

          <FormControl className={classes.formControl} color="primary">
            <InputLabel id="module-select-label">Module</InputLabel>
            <Select
            labelId="module-select-label"
            onChange={handleChange}
            >
            <MenuItem value={10}>AST Explorer</MenuItem>
            <MenuItem value={20}>Viewer</MenuItem>
            </Select>
         </FormControl>
        </div>
    )
}

export default ModuleSelect;