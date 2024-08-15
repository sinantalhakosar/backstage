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
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { GithubMDDocsContent } from './GithubMDDocsContent';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { configApiRef } from '@backstage/core-plugin-api';

const mockConfig = {
  getString: () => 'mock-value',
};

const server = setupServer(
  rest.get(
    'https://raw.githubusercontent.com/:owner/:repo/main/:mdFilePath',
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.text('# Sample Markdown\n\nThis is a sample markdown content.'),
      );
    },
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<GithubMDDocsContent />', () => {
  it('renders MarkdownContent when markdown is fetched successfully', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[configApiRef, mockConfig]]}>
        <GithubMDDocsContent owner="owner" repo="repo" mdFilePath="README.md" />
      </TestApiProvider>,
    );

    expect(screen.getByText('Sample Markdown')).toBeInTheDocument();
    expect(
      screen.getByText('This is a sample markdown content.'),
    ).toBeInTheDocument();
  });

  it('renders error panel when markdown fetch fails', async () => {
    server.use(
      rest.get(
        'https://raw.githubusercontent.com/:owner/:repo/main/:mdFilePath',
        (_req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ message: 'Not Found' }));
        },
      ),
    );

    await renderInTestApp(
      <TestApiProvider apis={[[configApiRef, mockConfig]]}>
        <GithubMDDocsContent owner="owner" repo="repo" mdFilePath="README.md" />
      </TestApiProvider>,
    );

    expect(
      screen.getByText('Error: Failed to fetch file content: Not Found'),
    ).toBeInTheDocument();
  });
});
