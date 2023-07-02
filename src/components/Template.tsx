import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  root: {
  }
});

const Template = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
    </div>
  );
}

export default Template;
