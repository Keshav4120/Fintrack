import React, { useEffect } from 'react';

const TickerTapeWidget = () => {
  useEffect(() => {
    if (!document.querySelector('.tradingview-widget-script')) {
      const script = document.createElement('script');
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.async = true;
      script.className = 'tradingview-widget-script';
      script.innerHTML = JSON.stringify({
        symbols: [
          { description: "", proName: "OANDA:NAS100USD" },
          { description: "", proName: "OANDA:SPX500USD" },
          { description: "", proName: "FX_IDC:USDINR" }
        ],
        showSymbolLogo: true,
        isTransparent: false,
        displayMode: "adaptive",
        colorTheme: "dark", // Dark theme for the widget
        locale: "en"
      });
      document.querySelector('.tradingview-widget-container__widget').appendChild(script);
    }
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      style={{
        maxWidth: '100%',
        margin: '0 auto',
        backgroundColor: '#1e1f23',
      }}
    >
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default TickerTapeWidget;
