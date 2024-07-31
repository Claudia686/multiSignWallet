import { ethers } from 'ethers'

const Buttons = ({ text, handler }) => {
  return (
    <div>
      <button onClick={handler} className='styled_button'>
        {text}
      </button>
    </div>
  )
}

export default Buttons;

