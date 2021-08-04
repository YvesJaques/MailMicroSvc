import { Readable } from 'stream';

import mongoose from 'mongoose';

import Contact from '../../src/schemas/Contact';
import Tag from '../../src/schemas/Tag';
import ImportContactsService from './ImportContactsService';

describe('Import', () =>{
    beforeAll(async () => {
        if (!process.env.MONGO_URL) {
            throw new Error('MongoDB server not initialized');
        }

        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
    });

    afterAll(async () => {
        mongoose.connection.close();
    });

    beforeEach(async () => {
        await Contact.deleteMany({});
        await Tag.deleteMany({})
    });

    it('Should be able to import new contacts', async () => {
        const contactsFileStream = Readable.from([
            'teste1@teste.com\n',
            'teste2@teste.com\n',
            'teste3@teste.com\n',
        ])

        const importContacts = new ImportContactsService();

        await importContacts.run(contactsFileStream, ['Students', 'Class A']);

        const createdTags = await Tag.find({}).lean();

        expect(createdTags).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ title: 'Students' }),
                expect.objectContaining({ title: 'Class A' }),
            ]),
        );

        const createdTagsIds = createdTags.map(tag => tag._id);

        const createdContacts = await Contact.find({}).lean();

        expect(createdContacts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    email: 'teste1@teste.com',
                    tags: createdTagsIds,
                }),
                expect.objectContaining({
                    email: 'teste2@teste.com',
                    tags: createdTagsIds,
                }),
                expect.objectContaining({
                    email: 'teste3@teste.com',
                    tags: createdTagsIds,
                }),
            ]),
        );
    });

    it('Should not recreate already existent tags', async () => {
        const contactsFileStream = Readable.from([
            'teste1@teste.com\n',
            'teste2@teste.com\n',
            'teste3@teste.com\n',
        ])

        const importContacts = new ImportContactsService();

        await Tag.create({ title: 'Students' });

        await importContacts.run(contactsFileStream, ['Students', 'Class A']);

        const createdTags = await Tag.find({}).lean();

        expect(createdTags).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ title: 'Students' }),
                expect.objectContaining({ title: 'Class A' }),
            ]),
        );
    })
})