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
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { Readable } from 'stream';
import {
  DocumentCollatorFactory,
  IndexableDocument,
} from '@backstage/plugin-search-common';

export interface GithubMDDocument extends IndexableDocument {}

export type GithubMDCollatorFactoryOptions = {
  logger: LoggerService;
};

export class GithubMDCollatorFactory implements DocumentCollatorFactory {
  private readonly logger: LoggerService;
  public readonly type: string = 'github-md-docs';

  private constructor(options: GithubMDCollatorFactoryOptions) {
    this.logger = options.logger;
  }

  static fromConfig(_config: Config, options: GithubMDCollatorFactoryOptions) {
    return new GithubMDCollatorFactory(options);
  }

  async getCollator() {
    return Readable.from(this.execute());
  }

  async *execute(): AsyncGenerator<GithubMDDocument> {
    this.logger.info(`Executed GithubMDCollatorFactory`);
  }
}
