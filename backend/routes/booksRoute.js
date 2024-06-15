import express from 'express';
import { Book } from '../models/bookModel.js';

const router = express.Router();

// Route for save a new book
router.post('/', async (request, response) => {
    try {
        if (
            // we check tp make sure these details are filled out and if not...
            !request.body.title || !request.body.author || !request.body.publishYear
        ) {
            // we return a messsage to fill out all detaiks
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear'
            });
        }
        // Then we create a new variable
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        }
        // We await it and once its recieved its created
        const book = await Book.create(newBook);
        // message sent to say its been recieved.
        return response.status(201).send(book);
    } catch (error) {
        console.log(error.message)
        response.status(500).send({ message: error.message })
    }
});

// get all books

router.get('/', async (request, response) => {
    try {
        // gets a list of all books in database
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books
        });
    } catch (error) {
        // Sending an error message
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// get one books
router.get('/:id', async (request, response) => {
    try {

        // de structure it
        const { id } = request.params;
        // gets a list of all books in database
        const book = await Book.findById(id);

        return response.status(200).json(book);

    } catch (error) {
        // Sending an error message
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Update book

router.put('/:id', async (request, response) => {
    try {
        // validation
        if (
            !request.body.title || !request.body.author || !request.body.publishYear
        ) { 
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear'
            })
        }

        // de structure it
        const { id } = request.params;

        const result = await Book.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        }

        return response.status(200).send({ message: 'Book updated successfully' })
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})


// delete book
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        }

        return response.status(200).send({ message: 'Book deleted successfully' })

    } catch (error) {
        response.status(500).send({ message: error.message });
    }
});

export default router;