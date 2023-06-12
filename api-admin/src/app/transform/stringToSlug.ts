import slugify from '@sindresorhus/slugify';
import {Model} from 'mongoose';
import * as _ from 'lodash';
const RegexEscape = require('regex-escape');

export default async function (
  model: typeof Model,
  string: string,
  sluggedID: boolean,
  dashed: boolean
) {
  const slug = slugify(string);
  return getUniqueSlug(model, slug, sluggedID, dashed);
}

type Slugged = {
  slug: string;
  userSlug: string;
  _id: string;
};

async function getUniqueSlug(
  model: typeof Model,
  baseSlug: string,
  sluggedID = false,
  dashed = false
) {
  let slugs;

  if (!sluggedID) {
    const docs: Slugged[] = await model
      .find({slug: {$regex: new RegExp(`^${RegexEscape(baseSlug)}`)}}, 'slug')
      .exec();
    slugs = docs.map((x: Slugged) => x.slug);
  } else {
    const docs: Slugged[] = await model
      .find({_id: {$regex: new RegExp(`^${RegexEscape(baseSlug)}`)}}, 'id')
      .exec();
    slugs = docs.map((x: Slugged) => x._id);
  }

  const skip = baseSlug.length;

  const exists = slugs.includes(baseSlug);
  if (!exists) {
    return baseSlug;
  }

  const maxSlug =
    (_.chain(slugs)
      .map((x: string) => parseInt(x.substring(skip).replace('-', '')))
      .filter((x: any) => !isNaN(x))
      .compact()
      .max()
      .value() || 0) + 1;

  return `${baseSlug}${dashed ? '-' : ''}${maxSlug}`;
}
