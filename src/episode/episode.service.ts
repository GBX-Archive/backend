import { Injectable } from '@nestjs/common';
import prisma from '../../prisma';

const valid_filters = [
    'date__gte',
    'date__lte',
    'show',
    'sort',
    'order',
    'page',
    'limit',
];

@Injectable()
export class EpisodeService {
    async getEpisodes(query: any) {
        const filter = {};

        if (query.show) {
            if (query.show === 'all') {
                delete query.show;
            } else if (query.show === 'gbx') {
                filter['show'] = 'GBX';
            } else if (query.show === 'snt') {
                filter['show'] = 'Sunday Night Takeover';
            }
        }
    
        if (query.date__gte || query.date__lte) {
            filter['date'] = {
                ...(query.date__gte ? { gte: new Date(query.date__gte) } : {}),
                ...(query.date__lte ? { lte: new Date(query.date__lte) } : {}),
            };
        }

        const sort = query.sort || 'date'; // sort by date by default
        const order = query.order || 'desc'; // latest first by default
        const page = query.page ? parseInt(query.page) : 1; // first page by default
        const limit = query.limit ? parseInt(query.limit) : 10; // 10 episodes per page by default

        const count = await prisma.episode.count({ where: filter });

        const episodes = await prisma.episode.findMany({
            where: filter,
            orderBy: {
                [sort]: order,
            },
            skip: (page - 1) * limit,
            take: limit,
        });

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
