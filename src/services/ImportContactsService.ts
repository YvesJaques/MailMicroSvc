import { Readable } from 'stream';
import csvParse from 'csv-parse';

import Tag from '@schemas/Tag';
import Contact from '@schemas/Contact';

class ImportContactsService {
    async run(contactsFileStream: Readable, tags: string[]): Promise<void> {
        const parser = csvParse({
            delimiter: ';',
        });

        const parseCSV = contactsFileStream.pipe(parser);

        const existentTags = await Tag.find({
            title: {
                $in: tags,
            },
        });

        const existentTagsTitles = existentTags.map(tag => tag.title);

        const newTagsData = tags
        .filter(tag => !existentTagsTitles.includes(tag))
        .map(tag => ({title: tag,}));

        const createdTags = await Tag.create(newTagsData);
        const tagsIds = createdTags.map(tag => tag._id);

        parseCSV.on('data', async line => {
            const [email] = line;

            await Contact.create({ email, tags: tagsIds });
        });

        await new Promise(resolve => parseCSV.on('end', resolve));
    }
}

export default ImportContactsService;