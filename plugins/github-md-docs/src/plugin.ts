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
import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { GithubMDDocSearchResultListItemProps } from './components/GithubMDDocSearchResultListItem/GithubMDDocSearchResultListItem';
import {
  createSearchResultListItemExtension,
  SearchResultListItemExtensionProps,
} from '@backstage/plugin-search-react';

export const githubMdDocsPlugin = createPlugin({
  id: 'github-md-docs',
  routes: {
    root: rootRouteRef,
  },
});

export const GithubMdDocsPage = githubMdDocsPlugin.provide(
  createRoutableExtension({
    name: 'GithubMdDocsPage',
    component: () =>
      import('./components/GithubMDDocPage').then(m => m.GithubMDDocPage),
    mountPoint: rootRouteRef,
  }),
);

/**
 * React extension used to render results on Search page or modal
 *
 * @public
 */
export const GithubMDDocSearchResultListItem: (
  props: SearchResultListItemExtensionProps<GithubMDDocSearchResultListItemProps>,
) => JSX.Element | null = githubMdDocsPlugin.provide(
  createSearchResultListItemExtension({
    name: 'GithubMDDocSearchResultListItem',
    component: () =>
      import(
        './components/GithubMDDocSearchResultListItem/GithubMDDocSearchResultListItem'
      ).then(m => m.GithubMDDocSearchResultListItem),
    predicate: result => result.type === 'github-md-docs',
  }),
);
