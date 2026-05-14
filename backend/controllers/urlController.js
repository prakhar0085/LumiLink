const Url = require('../models/Url');
const { nanoid } = require('nanoid');

exports.createShortUrl = async (req, res) => {
  const { originalUrl, customAlias, expiresAt } = req.body;
  
  // Use the host from the request if BASE_URL is not set
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const baseUrl = process.env.BASE_URL || `${protocol}://${req.get('host')}`;

  if (!originalUrl) {
    return res.status(400).json({ message: 'Original URL is required' });
  }

  // Validate URL format here if needed

  let shortCode = customAlias;
  if (shortCode) {
    const existing = await Url.findOne({ shortCode });
    if (existing) {
      return res.status(400).json({ message: 'Custom alias already in use' });
    }
  } else {
    shortCode = nanoid(8);
  }

  const shortUrl = `${baseUrl}/${shortCode}`;

  try {
    const newUrl = await Url.create({
      originalUrl,
      shortCode,
      shortUrl,
      createdBy: req.user ? req.user._id : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    res.status(201).json(newUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (url) {
      if (url.expiresAt && new Date() > url.expiresAt) {
        return res.status(410).json({ message: 'URL has expired' });
      }

      url.clicks++;
      
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      url.analytics.push({
        ipAddress: ipAddress,
        device: req.useragent ? (req.useragent.isMobile ? 'Mobile' : (req.useragent.isTablet ? 'Tablet' : 'Desktop')) : 'Unknown',
        browser: req.useragent ? req.useragent.browser : 'Unknown',
        country: 'Unknown', // GeoIP could be added here
      });

      await url.save();
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ message: 'No URL found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserUrls = async (req, res) => {
  try {
    const urls = await Url.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUrl = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    if (url.createdBy && url.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await url.deleteOne();
    res.json({ message: 'URL removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
