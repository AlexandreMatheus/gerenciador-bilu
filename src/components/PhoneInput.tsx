import React from 'react';
import InputMask from 'react-input-mask';

const PhoneInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <InputMask
      mask="(99) 9 9999-9999"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    >
      {(inputProps: React.ComponentProps<'input'>) => (
        <input
          {...inputProps}
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="(XX) X XXXX-XXXX"
          required
        />
      )}
    </InputMask>
  );
};

export default PhoneInput;