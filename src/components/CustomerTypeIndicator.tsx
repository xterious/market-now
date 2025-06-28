import React from 'react';
import { Chip, Box, Tooltip } from '@mui/material';
import { 
  Diamond, 
  Person,
  Star,
  StarBorder
} from '@mui/icons-material';
import { useCustomer } from '@/contexts/CustomerContext';

interface CustomerTypeIndicatorProps {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'chip' | 'icon' | 'both';
}

const CustomerTypeIndicator: React.FC<CustomerTypeIndicatorProps> = ({ 
  showLabel = true, 
  size = 'small',
  variant = 'chip'
}) => {
  const { customerType, isSpecialCustomer } = useCustomer();

  const getIcon = () => {
    if (isSpecialCustomer) {
      return <Diamond sx={{ fontSize: size === 'large' ? 24 : size === 'medium' ? 20 : 16 }} />;
    }
    return <Person sx={{ fontSize: size === 'large' ? 24 : size === 'medium' ? 20 : 16 }} />;
  };

  const getLabel = () => {
    return isSpecialCustomer ? 'Special Customer' : 'Normal Customer';
  };

  const getColor = () => {
    return isSpecialCustomer ? 'primary' : 'default';
  };

  if (variant === 'icon') {
    return (
      <Tooltip title={getLabel()}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          {getIcon()}
        </Box>
      </Tooltip>
    );
  }

  if (variant === 'both') {
    return (
      <Chip
        icon={getIcon()}
        label={showLabel ? getLabel() : customerType}
        color={getColor()}
        size={size}
        variant="outlined"
        sx={{ 
          fontWeight: 'bold',
          '& .MuiChip-icon': {
            color: isSpecialCustomer ? 'primary.main' : 'text.secondary'
          }
        }}
      />
    );
  }

  return (
    <Chip
      icon={getIcon()}
      label={showLabel ? getLabel() : customerType}
      color={getColor()}
      size={size}
      variant="outlined"
      sx={{ 
        fontWeight: 'bold',
        '& .MuiChip-icon': {
          color: isSpecialCustomer ? 'primary.main' : 'text.secondary'
        }
      }}
    />
  );
};

export default CustomerTypeIndicator; 