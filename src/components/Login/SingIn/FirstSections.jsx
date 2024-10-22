import { SmileOutlined, HomeOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import './FirstSections.css'


function FirstSections() {
  return (
    <div className="flex justify-around pt-40">
      <SmileOutlined className="signin-icon hover-effect" />
      <HomeOutlined className="signin-icon hover-effect" />
      <SettingOutlined className="signin-icon hover-effect" />
      <UserOutlined className="signin-icon hover-effect" />
    </div>
  );
}

export default FirstSections;
