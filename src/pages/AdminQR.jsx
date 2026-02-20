import { useState } from 'react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import NYULogo from '../NYU_logo.png';

export default function AdminQR() {
  const navigate = useNavigate();

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
      // QR 안에 들어갈 실제 URL
      const qrData = `${window.location.origin}/attendance?meeting=${meetingNumber}`;

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
      setStatus('Failed to generate QR Code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="flex items-center w-full px-[32px] py-[16px] bg-[#1a1a1a] border-b border-gray-800">
        <div
          onClick={() => navigate('/admin')}
          className="flex items-center text-[32px] font-bold cursor-pointer hover:opacity-80 transition-opacity text-white"
        >
          LikeLion x <span className="text-nyu-purple ml-[8px]">NYU</span>
          <img src={NYULogo} alt="logo" className="h-[32px] ml-[8px]" />
        </div>

        <div className="flex items-center gap-[16px] ml-auto">
          <button
            onClick={() => navigate('/admin/qr')}
            className="px-[28px] py-[13px] rounded-full text-[20px] bg-[#2a2a2a] text-white border border-gray-700"
          >
            Attendance QR
          </button>

          <button
            onClick={() => navigate('/admin/users')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            User Management
          </button>

          <button
            onClick={() => navigate('/admin/calendar')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Calendar Management
          </button>

          <button
            onClick={() => navigate('/admin/projects')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Projects Management
          </button>

          <button
            onClick={() => navigate('/login')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Log In
          </button>
        </div>
      </nav>

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
