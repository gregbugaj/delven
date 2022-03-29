import React, { useMemo } from 'react'
import { useEffect, useLayoutEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Button, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({

}));


export default function ShortcutsComponent() {

  useLayoutEffect(() => {
  }, []);

  return (
    <div className='Editor-Container' >
      <div className='Editor-Container-Header'>
        <Typography variant="h5">Shortcuts</Typography>
        <hr />
      </div>

      <div className='Editor-Container' style={{ padding: "0px", border: "0px solid red" }} >
        <div>
          <strong>Editor</strong>
          <div style={{ marginLeft: '25px' }}>
            <Grid container direction="row">
              <Grid container justify="space-between" style={{ padding: "5px" }}  >
                <Grid item xs={4}>Compile Script</Grid>
                <Grid item xs={4}>
                  <Button variant="outlined" color="primary">Ctrl</Button>
                  +
                <Button variant="outlined" color="primary">Enter</Button>
                </Grid>
                <Grid item xs={4}>{/* NOOP */}</Grid>
              </Grid>

              <Grid container justify="space-between" style={{ padding: "5px" }} >
                <Grid item xs={4}>Execute Script</Grid>
                <Grid item xs={4} >
                  <Button variant="outlined" color="primary">Ctrl</Button>
                  +
                  <Button variant="outlined" color="primary"  >Shift</Button>
                  +
                <Button variant="outlined" color="primary">Enter</Button>
                </Grid>
                <Grid item xs={4}>{/* NOOP */}</Grid>
              </Grid>


              <Grid container justify="space-between" style={{ padding: "5px" }} >
                <Grid item xs={4}>Close Current</Grid>
                <Grid item xs={4} >
                  <Button variant="outlined" color="primary">Ctrl</Button>
                  +
                  <Button variant="outlined" color="primary">K</Button>
                  +
                <Button variant="outlined" color="primary">W</Button>
                </Grid>
                <Grid item xs={4}>{/* NOOP */}</Grid>
              </Grid>


              <Grid container justify="space-between" style={{ padding: "5px" }} >
                <Grid item xs={4}>Close Saved</Grid>
                <Grid item xs={4} >
                  <Button variant="outlined" color="primary">Ctrl</Button>
                  +
                  <Button variant="outlined" color="primary">K</Button>
                  +
                <Button variant="outlined" color="primary">U</Button>
                </Grid>
                <Grid item xs={4}>{/* NOOP */}</Grid>
              </Grid>

              <Grid container justify="space-between" style={{ padding: "5px" }} >
                <Grid item xs={4}>Close All</Grid>
                <Grid item xs={4} >
                  <Button variant="outlined" color="primary">Ctrl</Button>
                  +
                  <Button variant="outlined" color="primary">K</Button>
                  +
                <Button variant="outlined" color="primary">X</Button>
                </Grid>
                <Grid item xs={4}>{/* NOOP */}</Grid>
              </Grid>


            </Grid>
          </div>
          <hr />
        </div>


        {/* Global */}

        <div>
          <strong>Global</strong>
          <div style={{ marginLeft: '25px' }}>
            <Grid container direction="row">
              <Grid container justify="space-between" style={{ padding: "5px" }}  >
                <Grid item xs={4}>Next Panel</Grid>
                <Grid item xs={4}>
                  <Button variant="outlined" color="primary">Ctrl</Button>
                  +
                <Button variant="outlined" color="primary">[</Button>
                </Grid>
                <Grid item xs={4}>{/* NOOP */}</Grid>
              </Grid>

              <Grid container justify="space-between" style={{ padding: "5px" }}  >
                <Grid item xs={4}>Previous Panel</Grid>
                <Grid item xs={4}>
                  <Button variant="outlined" color="primary">Ctrl</Button>
                  +
                <Button variant="outlined" color="primary">]</Button>
                </Grid>
                <Grid item xs={4}>{/* NOOP */}</Grid>
              </Grid>

            </Grid>
          </div>
          <hr />
        </div>

      </div>

      <div className='Editor-Container-Footer' style={{ border: "1px solid purple", display: "none" }}>
        Footer  :  {Date.now()}
      </div>
    </div>
  )
}
