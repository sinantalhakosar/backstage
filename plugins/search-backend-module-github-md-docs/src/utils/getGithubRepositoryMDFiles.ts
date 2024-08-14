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

import { Repository } from '../types';

const githubApiUrl = 'https://api.github.com';

interface Props extends Repository {}

export async function getGithubRepositoryMDFiles({ owner, repo }: Props) {
  try {
    const apiUrl = `${githubApiUrl}/repos/${owner}/${repo}/git/trees/main?recursive=1`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch repository tree: ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Filter for .md files
    const mdFiles = data.tree.filter((item: any) => item.path.endsWith('.md'));

    return mdFiles;
  } catch (error) {
    return new Error(`Error fetching markdown files: ${error.message}`);
  }
}
