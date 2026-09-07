import React from 'react';
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name, className = "w-5 h-5", defaultIcon = "Code" }) => {
  if (!name) {
    const DefaultComponent = Icons[defaultIcon] || Icons.Code;
    return <DefaultComponent className={className} />;
  }

  // Handle case sensitivity or icon mappings
  const IconComponent = Icons[name] || Icons[defaultIcon] || Icons.Code;
  return <IconComponent className={className} />;
};

export default DynamicIcon;
