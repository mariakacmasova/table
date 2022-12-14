import { post } from './request';

function formatSQL(sql: string, context: Record<string, $TSFixMe>) {
  const names = Object.keys(context);
  const vals = Object.values(context);
  return new Function(...names, `return \`${sql}\`;`)(...vals);
}

export const queryBySQL = (sql: string, context: Record<string, $TSFixMe>) => async () => {
  if (!sql) {
    return [];
  }
  const formattedSQL = formatSQL(sql, context);
  if (sql.includes('$')) {
    console.log(formattedSQL);
  }
  const res = await post('/query', { query: formattedSQL });
  return res;
};
