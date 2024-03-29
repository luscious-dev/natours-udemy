const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 200 successful
// 201 created successfully

// 404 resource not found
// 401 Unauthorized access
// 403 Insufficient privilege

// 1) GLOBAL MIDDLEWARES
// app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        'https://*.tile.openstreetmap.org/',
        'https://unpkg.com/',
        'https://images.unsplash.com',
        'https://api.mapbox.com',
        'https://*.basemaps.cartocdn.com/'
      ],
      scriptSrc: [
        "'self'",
        'https://unpkg.com/',
        'https://cdnjs.cloudflare.com'
      ]
    }
  })
);

// app.use(
//   helmet.crossOriginResourcePolicy({
//     policy: 'cross-origin'
//   })
// );

// Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limi requests from sam IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});

app.use('/api', limiter);

// Body parser, reading data from the body into req.body
// File limit implemented
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data Sanitization against NoSql query injection
app.use(mongoSanitize());

// Data sanitozation against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Serving static files
app.use(express.static(path.join(__dirname, './public')));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
