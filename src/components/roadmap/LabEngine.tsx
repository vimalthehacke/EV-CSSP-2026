import React from 'react';
import { Lab } from '../../types';
import { LabContainer } from './engine/LabContainer';

interface LabEngineProps {
  lab: Lab;
  onClose: () => void;
}

export const LabEngine: React.FC<LabEngineProps> = ({ lab, onClose }) => {
  return (
    <LabContainer 
      lab={lab} 
      onClose={onClose} 
    />
  );
};
