import { useState } from 'react'
import Header from '../../Header'
import FirstSections from './FirstSections'
import TerceraStep from './TerceraStep'
import UserProfileForm from './UserProfileForm'
function SingIn() {
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegisterStatus = () => {
    setIsRegistered(!isRegistered)
  }

  return (
    <div className='bg-[#BB9EED] h-[120vh]'>
      <Header/>
      <FirstSections/>
      {!isRegistered && <UserProfileForm handleRegisterStatus={handleRegisterStatus} /> }
      {isRegistered &&
      <TerceraStep handleRegisterStatus={handleRegisterStatus} /> }
      </div>
  )
}

export default SingIn