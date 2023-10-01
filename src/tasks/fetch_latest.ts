import { Episode } from "../types/clyde_response";
import axios from "axios";
import uploadFile from "../../utils/s3";
import * as fs from 'fs';
import * as moment from "moment";
import * as db from '../../db';

const FetchLatest = async () => {
    const url = 'https://listenapi.planetradio.co.uk/api9.2/audibles?StationCode=cl1&listenagain.ShowId%5B%5D=13035&_pp=15&premium=1';
    const snt_url = 'https://listenapi.planetradio.co.uk/api9.2/audibles?StationCode=cl1&listenagain.ShowId%5B%5D=21729&_p=1&_pp=10&premium=1'; // sunday night takeover (George)

    try {
        const response = await axios.get(url);
        const snt_response = await axios.get(snt_url);

        // add a "type" property to each episode to differentiate between the two shows
        const data = response.data.map((ep: Episode) => {
            ep.type = 'GBX';
            return ep;
        }).concat(snt_response.data.map((ep: Episode) => {
            ep.type = 'Sunday Night Takeover';
            return ep;
        }));

        for (const ep of data) {
            const episode = await db.execQueryOne(`
                SELECT * FROM episode
                WHERE clyde_id = $1
            `, [ep.id]);

            if (episode === null) {
                console.log('adding episode');

                // download mp3 file 
                const mp3_response = await axios.get(ep.listenagain.ScheduleListenAgainMP3Url, {
                    responseType: 'arraybuffer'
                });

                // write to local file
                console.log('writing to local file');
                const filename = `${new Date(ep.published_at).getTime()}.mp3`;
                fs.writeFileSync(filename, mp3_response.data);

                // upload to digital ocean spaces
                console.log('uploading to digital ocean spaces');
                const mp3_url = await uploadFile(filename, `gbx/${moment(ep.published_at).format('YYYY[/]MM[/]ddd_DD')}.mp3`);

                // add episode
                const entry = await await db.execQueryOne(`
                    INSERT INTO episode (clyde_id, title, description, date, duration, mp3_url, image_url, show)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING id
                `, [ep.id, ep.title, ep.listenagain.ScheduleDescription, new Date(ep.published_at), ep.duration, mp3_url, ep.listenagain.ScheduleImageUrl, ep.type])

                console.log('done (', entry.id, ')');
            } else {
                // check if it has changed
                if (episode.title !== ep.title || episode.description !== ep.listenagain.ScheduleDescription || episode.duration !== ep.duration || episode.image_url !== ep.listenagain.ScheduleImageUrl) {
                    console.log('updating episode', episode.id);
                    // update episode
                    
                    await db.execQuery(`
                        UPDATE episode
                        SET title = $1, description = $2, duration = $3, image_url = $4
                        WHERE id = $5
                    `, [ep.title, ep.listenagain.ScheduleDescription, ep.duration, ep.listenagain.ScheduleImageUrl, episode.id])
                } else {
                    console.log('no changes to episode', episode.id);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
};

export default FetchLatest;