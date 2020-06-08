const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});
const app = require('./app');

mongoose.connect(process.env.DATABASE_ARRIBA,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log('DATABASE CONNECTION SUCCESS');
    });

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})

// Handling Unhandled Rejection
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! APP SHUTTING DOWN');
    console.log(err);
    // shutdown app 0: success 1: uncalled exception
    server.close(() => {
        process.exit(1);
    });
});

// uncaught errors (ex: variables that didn't define)
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! APP SHUTTING DOWN');
    console.log(err);
    // shutdown app 0: success 1: uncalled exception
    server.close(() => {
        process.exit(1);
    });
})

// will shutdown the app gracefully
// process.on('SIGTERM', () => {
//     console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
//     server.close(() => {
//       console.log('💥 Process terminated!');
//     });
//   });