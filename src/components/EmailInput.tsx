import React, { useState } from 'react';

const EmailInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(email)); // Atualiza a validação
    onChange(email); // Atualiza o valor no estado pai
  };

  return (
    <div>
      <input
        type="email"
        value={value}
        onChange={handleInputChange}
        className={`w-full p-2 border ${isValid ? 'border-gray-300' : 'border-red-500'} rounded-lg`}
        placeholder="Digite seu e-mail"
        required
      />
      {!isValid && (
        <p className="text-red-500 text-sm mt-1">Por favor, insira um e-mail válido.</p>
      )}
    </div>
  );
};

export default EmailInput;