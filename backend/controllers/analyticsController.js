const Url = require('../models/Url');

exports.getAnalytics = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    if (url.createdBy && url.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Process analytics data for the frontend charts
    const analytics = url.analytics;
    const clicks = url.clicks;
    const created = url.createdAt;

    // Group clicks by device
    const deviceStats = analytics.reduce((acc, curr) => {
      acc[curr.device] = (acc[curr.device] || 0) + 1;
      return acc;
    }, {});

    // Group clicks by browser
    const browserStats = analytics.reduce((acc, curr) => {
      acc[curr.browser] = (acc[curr.browser] || 0) + 1;
      return acc;
    }, {});

    res.json({
      url: url.shortUrl,
      originalUrl: url.originalUrl,
      totalClicks: clicks,
      createdAt: created,
      deviceStats,
      browserStats,
      timeline: analytics.slice(-50), // Send the last 50 clicks for timeline
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
