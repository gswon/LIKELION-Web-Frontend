import { useState } from 'react';
import QRCode from 'qrcode';
import AdminNav from '../components/AdminNav';

export default function AdminQR() {
  const [meetingNumber, setMeetingNumber] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [status, setStatus] = useState('');

  const loadQR = async () => {
    if (!meetingNumber) {
      setStatus('Please enter a meeting number.');
      return;
    }

    setStatus('Generating QR Code...');

    try {
      // 백엔드 API 호출
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/qr-create?meeting_number=${meetingNumber}`,
      );
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      // QR 안에 들어갈 실제 URL
      const qrData = `${window.location.origin}/attendance?meeting_number=${meetingNumber}`;

      // QR 이미지 생성
      const qrImageData = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      setQrImage(qrImageData);
      setStatus(`QR Code for Meeting #${meetingNumber}`);
    } catch (error) {
      console.error('QR generation error:', error);
      setStatus(`Failed to generate QR Code: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminNav />

      {/* Main QR Generator */}
      <div className="flex flex-col items-center justify-center mt-[80px] px-[32px]">
        <h1 className="text-[48px] font-bold text-white mb-[32px]">
          Attendance QR Generator
        </h1>

        {/* Meeting number input */}
        <input
          type="number"
          value={meetingNumber}
          onChange={(e) => setMeetingNumber(e.target.value)}
          placeholder="Enter meeting number"
          className="px-[16px] py-[12px] text-[20px] w-[280px] rounded-lg bg-[#2a2a2a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-nyu-purple"
        />

        <button
          onClick={loadQR}
          className="px-[32px] py-[16px] bg-nyu-purple text-white rounded-full text-[20px] mt-[24px] hover:opacity-80"
        >
          Generate QR Code
        </button>

        {/* QR Image */}
        {qrImage && (
          <div className="mt-[32px] flex justify-center">
            <img
              src={qrImage}
              alt="QR Code"
              className="w-[250px] border border-gray-600 rounded-lg"
            />
          </div>
        )}

        {/* Status message */}
        {status && (
          <p className="text-gray-300 text-[18px] mt-[20px]">{status}</p>
        )}
      </div>
    </div>
  );
}
