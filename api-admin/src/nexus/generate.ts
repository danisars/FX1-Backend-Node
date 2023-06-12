import {join} from 'path';
import {connectionPlugin, fieldAuthorizePlugin, makeSchema} from 'nexus';
import * as types from './index';
console.log(types);
export default makeSchema({
  types,
  contextType: {
    module: 'lib-api-common/src/interfaces',
    export: 'IAppResolverContext',
  },
  sourceTypes: {
    modules: [
      {
        module: 'lib-mongoose/build/index.d.ts',
        alias: 'db',
        typeMatch(type) {
          return new RegExp(
            `(?:interface|type|class|enum)\\s+(${type.name}Document)\\W`,
            'g'
          );
        },
      },
    ],
  },
  outputs: {
    schema: join(__dirname, '../../schema.graphql'),
    typegen: join(__dirname, './generated/typings.ts'),
  },
  prettierConfig: join(__dirname, '../../.prettierrc.js'),
  plugins: [connectionPlugin(), fieldAuthorizePlugin()],
});
