import { IApi } from 'umi-plugin-types';
import getRouteConfigFromDir from './lib/getRouteConfigFromDir';
import mergeRoute from './lib/mergeRoute';

const path = require('path');
const loader = path.join(__dirname, './loader');

export interface IOption {
  wrapper?: string;
  className?: string;
  style?: object;
  anchor?: string[] | boolean;
}

interface ExIApi extends IApi {
  service: Service;
}

interface Service {
  paths: Paths;
}

interface Paths {
  cwd: string;
  absPagesPath: string;
  absSrcPath: string;
  dirPath?: string;
}

export default function(api: ExIApi, option = {} as IOption) {
  api.modifyRoutes((routes: any[]) => {
    const mdRoutes = getRouteConfigFromDir(api.service.paths);
    return mergeRoute(mdRoutes, routes);
  });

  // url-loader excludes
  api.modifyDefaultConfig(config => {
    return {
      ...config,
      urlLoaderExcludes: [/.md$/],
    };
  });

  // loader
  api.chainWebpackConfig(config => {
    config.module
      .rule('md')
      .test(/.md$/)
      .use(loader)
      .options(option)
      .loader(loader);
  });
}
