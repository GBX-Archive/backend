import { Injectable } from '@nestjs/common';
import * as db from '../../db';

const valid_filters = [
  'date__gte',
  'date__lte',
  'date',
  'show',
  'sort',
  'order',
  'page',
  'limit',
];

@Injectable()
export class EpisodeService {
  async getEpisodes(query: any) {
    // remove invalid filters
    for (const key in query) {
      if (!valid_filters.includes(key)) {
        delete query[key];
      }
    }

    let filter = '';

    if (query.show) {
      if (query.show === 'all') {
        delete query.show;
      } else if (query.show === 'gbx') {
        filter += ` WHERE show = 'GBX'`;
      } else if (query.show === 'snt') {
        filter += ` WHERE show = 'Sunday Night Takeover'`;
      }
    }

    if (query.date__gte || query.date__lte) {
      if (filter) {
        filter += ' AND';
      } else {
        filter += ' WHERE';
      }

      if (query.date__gte && query.date__lte) {
        filter += ` date BETWEEN '${query.date__gte}' AND '${query.date__lte}'`;
      } else if (query.date__gte) {
        filter += ` date >= '${query.date__gte}'`;
      } else if (query.date__lte) {
        filter += ` date <= '${query.date__lte}'`;
      }
    }

    if (query.date && !query.date__gte && !query.date__lte) {
      // can be any time on that day
      if (filter) {
        filter += ' AND';
      } else {
        filter += ' WHERE';
      }

      filter += ` date BETWEEN '${query.date} 00:00:00' AND '${query.date} 23:59:59'`;
    }

    const sort = query.sort || 'date'; // sort by date by default
    const order = query.order || 'desc'; // latest first by default
    const page = query.page ? parseInt(query.page) : 1; // first page by default
    const limit = query.limit ? parseInt(query.limit) : 10; // 10 episodes per page by default

    const count = await db.execCount(`SELECT COUNT(*) FROM episode ${filter}`);

    const episodes = await db.execQuery(
      `SELECT * FROM episode ${
        filter ? filter : ''
      } ORDER BY ${sort} ${order.toUpperCase()} LIMIT ${limit} OFFSET ${
        (page - 1) * limit
      }`,
    );

    const pages = Math.ceil(count / limit);
    const next = page < pages ? page + 1 : null;
    const prev = page > 1 ? page - 1 : null;

    return {
      count,
      pages,
      next,
      prev,
      episodes,
    };
  }
}
