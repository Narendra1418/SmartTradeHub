const WatchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'My Watchlist' },
  items: [{
    symbol: { type: String, required: true },
    exchange: { type: String, default: 'NSE' },
    note: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Watchlist', WatchlistSchema);