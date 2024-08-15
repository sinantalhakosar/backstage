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
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  LinkButton,
  EmptyState,
} from '@backstage/core-components';
import { useParams, useSearchParams } from 'react-router-dom';
import { GithubMDDocsContent } from '../GithubMDDocsContent';

export const GithubMDDocPage = () => {
  /* 
    const { owner, repo, mdFilePath } = useRouteRefParams(rootRouteRef);
    should be used, but it is not working as expected. Desctructured items are undefined.
  */
  const { '*': path = '' } = useParams();

  const owner = path.split('/')[0];
  const repo = path.split('/')[1];

  const [searchParams] = useSearchParams();
  const mdFilePath = searchParams.get('path');

  const showEmptyState = !owner || !repo || !mdFilePath;

  return (
    <Page themeId="tool">
      <Header
        title="Welcome to github-md-docs!"
        subtitle="You can check information for .md files on Github"
      >
        <HeaderLabel label="Owner" value="Sinan Talha KOSAR" />
        <HeaderLabel label="Lifecycle" value="Development" />
      </Header>

      <Content>
        <ContentHeader title="Github Markdown Document">
          <SupportButton>View .md file on Github repository here</SupportButton>
        </ContentHeader>

        {showEmptyState ? (
          <EmptyState
            missing="content"
            title="Missing parameters"
            description="Check out url parameters. It should be in the format of /owner/repo?path=mdFilePath"
            action={
              <LinkButton to="/" variant="contained">
                Home
              </LinkButton>
            }
          />
        ) : (
          <GithubMDDocsContent
            owner={owner}
            repo={repo}
            mdFilePath={mdFilePath}
          />
        )}
      </Content>
    </Page>
  );
};
