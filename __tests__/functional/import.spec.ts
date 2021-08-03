import mongoose from 'mongoose';
import Contact from '../../src/schemas/Contact';

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
    });

    it('Should be able to import new contacts', async () => {
        await Contact.create({ email: 'test@test.com' });

        const list = await Contact.find({});

        expect(list).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    email: 'test@test.com',
                })
            ])
        )
    });
})