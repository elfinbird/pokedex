import React, { useEffect, useState } from 'react';
import README from '../../README.md';
import ReactMarkdown from 'react-markdown';
import { tss } from '../tss';

export const HomePage = () => {
  const { classes } = useStyles();
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch(README)
      .then((res) => res.text())
      .then((res) => {
        setMarkdown(res);
      });
  }, []);

  return (
    <div className={classes.root}>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    '& p': {
      color: 'rgba(255,255,255,.68)',
    },
    '& hr': {
      margin: '24px 0px',
      borderTop: '1px solid rgba(255,255,255,.3)',
      borderBottom: '0px',
      borderLeft: '0px',
      borderRight: '0px',
    },
    '& p, & li': {
      lineHeight: '24px',
    },
    '& li': {
      marginTop: '12px',
    },
  },
}));
