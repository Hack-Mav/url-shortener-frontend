import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
  className?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url, size = 200, className = '' }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    const generateQRCode = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      
      try {
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });
        setQrCodeUrl(qrDataUrl);
      } catch (err) {
        setError('Failed to generate QR code');
        console.error('QR Code generation error:', err);
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, [url, size]);

  const handleDownload = (): void => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ width: size, height: size }}>
        <span className="text-red-500 text-xs text-center px-2">{error}</span>
      </div>
    );
  }

  if (!qrCodeUrl) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <div className="border-2 border-gray-200 rounded-lg p-2 bg-white">
        <img 
          src={qrCodeUrl} 
          alt="QR Code" 
          className="block"
          style={{ width: size, height: size }}
        />
      </div>
      <button
        onClick={handleDownload}
        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Download QR Code
      </button>
    </div>
  );
};

export default QRCodeGenerator;
