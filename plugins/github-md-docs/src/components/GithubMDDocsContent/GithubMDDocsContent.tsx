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
import React from 'react';
import {
  Progress,
  ResponseErrorPanel,
  MarkdownContent,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { GithubMDDocInfoCard } from '../GithubMDDocInfoCard';

const useStyles = makeStyles((theme: Theme) => ({
  markdownWrapper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1, 3, 1, 3),
    borderRadius: theme.shape.borderRadius,
  },
}));

const githubBaseUrl = 'https://github.com';
const rawGithubBaseUrl = `https://raw.githubusercontent.com`;

interface Props {
  owner: string;
  repo: string;
  mdFilePath: string;
}

export const GithubMDDocsContent = ({ owner, repo, mdFilePath }: Props) => {
  const classes = useStyles();

  const { value, loading, error } = useAsync(async (): Promise<
    string | Error
  > => {
    try {
      const fileUrl = `${rawGithubBaseUrl}/${owner}/${repo}/main/${mdFilePath}`;
      const fileResponse = await fetch(fileUrl).then(response => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch file content: ${response.statusText}`,
          );
        }
        return response;
      });

      const content = await fileResponse.text();

      return content;
    } catch (exception) {
      return exception;
    }
  }, [mdFilePath]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  if (value instanceof Error) {
    return <ResponseErrorPanel error={value} />;
  }

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <GithubMDDocInfoCard
          owner={{ text: owner, link: `${githubBaseUrl}/${owner}` }}
          repo={{ text: repo, link: `${githubBaseUrl}/${owner}/${repo}` }}
          mdFilePath={{
            text: mdFilePath,
            link: `${githubBaseUrl}/${owner}/${repo}/blob/main/${mdFilePath}`,
          }}
        />
      </Grid>
      <Grid item>
        <div className={classes.markdownWrapper}>
          <MarkdownContent content={value ?? ''} linkTarget="_blank" />
        </div>
      </Grid>
    </Grid>
  );
};
