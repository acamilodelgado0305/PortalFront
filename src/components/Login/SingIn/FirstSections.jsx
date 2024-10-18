import { SmileOutlined, HomeOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

function FirstSections() {
  return (
    <div className={`flex justify-around pt-40`}>
      <SmileOutlined className={`text-violet-600 text-6xl`} />
      <HomeOutlined className={`text-violet-600 text-6xl`} />
      <SettingOutlined className={`text-violet-600 text-6xl`} />
      <UserOutlined className={`text-violet-600 text-6xl`} />
    </div>
  );
}

export default FirstSections;
