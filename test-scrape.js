const https = require('https');

https.get('https://ipowatch.in/ipo-grey-market-premium-latest-ipo-gmp/', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Regex table extraction
    const tableMatch = data.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
    if (!tableMatch) return console.log('No table found');
    
    const rows = tableMatch[1].match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    rows.slice(0, 10).forEach((r, idx) => {
      const cols = (r.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || []).map(c => 
        c.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()
      );
      console.log(`Row ${idx}:`, cols);
    });
  });
}).on('error', console.error);
