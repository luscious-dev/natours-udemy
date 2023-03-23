const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Tour = require('./tourModel');

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  //   this.populate({ path: 'tour', select: 'name' }).populate({
  //     path: 'user',
  //     select: 'name photo'
  //   });
  next();
});

reviewSchema.statics.calculateAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: null,
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', async function(doc, next) {
  // this and doc are the same (According to my observation)
  await this.constructor.calculateAverageRatings(this.tour);
  next();
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function(doc, next) {
  await doc.constructor.calculateAverageRatings(this.r.tour);
  // this.r = await this.findOne();
  // console.log(this.r);
  next();
});

module.exports = mongoose.model('Reviews', reviewSchema);
