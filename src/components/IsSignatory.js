import React from 'react'

const IsSignatory = ({ multiSigWallet, isSignatory, setIsSignatory, address, setAddress }) => {
  const checkSignatoryHandler = async () => {
      const result = await multiSigWallet.isSignatory(address);
      setIsSignatory(result);
      setIsSignatory(false);  
  }

  return (
    <div className='isSignatory_input'>
      <input 
        type='text'
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={checkSignatoryHandler} className='button_signatory'>
        Check Signatory
      </button>
      {isSignatory !== null && (
        <div className='message_container'>
          {isSignatory ? 'This address is a signatory' : 'This address is not a signatory'}
        </div>
      )}
    </div>
  );
};

export default IsSignatory;
