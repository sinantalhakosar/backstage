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
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { MarkdownContent } from '@backstage/core-components';

const rawGithubBaseUrl = `https://raw.githubusercontent.com`;

interface Props {
  owner: string;
  repo: string;
  mdFilePath: string;
}

export const GithubMDDocFetchComponent = ({
  owner,
  repo,
  mdFilePath,
}: Props) => {
  const { value, loading, error } = useAsync(async (): Promise<string> => {
    try {
      const fileUrl = `${rawGithubBaseUrl}/${owner}/${repo}/main/${mdFilePath}`;
      const fileResponse = await fetch(fileUrl);

      const content = await fileResponse.text();

      return content;
    } catch (exception) {
      return exception.message;
    }
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  if (!value) {
    return null;
  }

  return <MarkdownContent content={value} linkTarget="_blank" />;
};
