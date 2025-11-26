import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import QRCode from 'qrcode';
import NYULogo from '../NYU_logo.png';

export default function AdminPage() {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [meetingNumber, setMeetingNumber] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [status, setStatus] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleQRClick = () => {
    setShowQR(true);
    setShowUserManagement(false);
  };

  const handleUserManagementClick = async () => {
    setShowQR(false);
    setShowUserManagement(true);
    await fetchMembers();
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/adminpage/members_list`
      );
      const data = await response.json();
      setMembers(data.members || []);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadQR = async () => {
    if (!meetingNumber) {
      setStatus('Please enter a meeting number.');
      return;
    }

    setStatus('Generating QR Code...');

    try {
      // 프론트엔드에서 직접 QR 코드 생성
      const qrData = `${window.location.origin}/attendance?meeting=${meetingNumber}`;

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
      console.error('QR Code generation error:', error);
      setStatus('Error generating QR code.');
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
          <img src={NYULogo} alt="NYU Logo" className="h-[32px] ml-[8px]" />
        </div>

        <div className="flex items-center gap-[16px] ml-auto">
          <button
            onClick={() => navigate('/admin/qr')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full 
            text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Attendance QR
          </button>

          <button
            onClick={() => navigate('/admin/users')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full 
            text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            User Management
          </button>

          <button
            onClick={() => navigate('/login')}
            className="px-[28px] py-[13px] border border-gray-700 rounded-full 
            text-[20px] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Main admin homepage */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-[#0a0a0a]">
        <h1 className="text-[96px] font-bold text-white">NYU Admin Page</h1>
      </div>
    </div>
  );
}
