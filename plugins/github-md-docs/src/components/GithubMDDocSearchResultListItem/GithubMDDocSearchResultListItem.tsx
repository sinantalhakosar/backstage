/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { ReactNode } from 'react';
import { ResultHighlight } from '@backstage/plugin-search-common';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { Link } from '@backstage/core-components';
import { HighlightedSearchResultText } from '@backstage/plugin-search-react';
import { makeStyles } from '@material-ui/core/styles';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { GithubMDDocument } from '@backstage/plugin-search-backend-module-github-md-docs';

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  secondary: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export interface GithubMDDocSearchResultListItemProps {
  icon?: ReactNode;
  secondaryAction?: ReactNode;
  result?: GithubMDDocument;
  highlight?: ResultHighlight;
  rank?: number;
  lineClamp?: number;
  toggleModal?: () => void;
}

export const GithubMDDocSearchResultListItem = ({
  result,
  highlight,
  icon,
  secondaryAction,
  lineClamp = 5,
}: GithubMDDocSearchResultListItemProps) => {
  const classes = useStyles();

  if (!result) return null;

  return (
    <div className={classes.wrapper}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText
        primaryTypographyProps={{ variant: 'h6' }}
        primary={
          <Link noTrack to={result.location}>
            {highlight?.fields.title ? (
              <HighlightedSearchResultText
                text={highlight?.fields.title || ''}
                preTag={highlight?.preTag || ''}
                postTag={highlight?.postTag || ''}
              />
            ) : (
              result.title
            )}
          </Link>
        }
        secondary={
          <div className={classes.secondary}>
            <Typography
              component="span"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: lineClamp,
                overflow: 'hidden',
              }}
              color="textPrimary"
              variant="body2"
            >
              Path:{' '}
              {highlight?.fields.text ? (
                <HighlightedSearchResultText
                  text={highlight.fields.text}
                  preTag={highlight.preTag}
                  postTag={highlight.postTag}
                />
              ) : (
                result.text
              )}
            </Typography>

            <Typography
              component="span"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: lineClamp,
                overflow: 'hidden',
              }}
              color="textSecondary"
              variant="body2"
            >
              Repository:{' '}
              <Link noTrack to={result.repositoryLink}>
                {highlight?.fields.repositoryOwner ? (
                  <HighlightedSearchResultText
                    text={highlight.fields.repositoryOwner}
                    preTag={highlight.preTag}
                    postTag={highlight.postTag}
                  />
                ) : (
                  result.repositoryOwner
                )}
                /
                {highlight?.fields.repositoryName ? (
                  <HighlightedSearchResultText
                    text={highlight.fields.repositoryName}
                    preTag={highlight.preTag}
                    postTag={highlight.postTag}
                  />
                ) : (
                  result.repositoryName
                )}
                <OpenInNew fontSize="inherit" />
              </Link>
            </Typography>
          </div>
        }
      />
    </div>
  );
};
