import React from 'react';
import { Tooltip, InputGroup, Intent, Icon, Button } from '@blueprintjs/core';
import { Flex, Box } from 'reflexbox';

function FieldWithError (props) {
  const {
    fieldname,
    placeholder,
    handleChange,
    values,
    errors,
    setFieldValue,
    lock,
    disabled
  } = props;

  const handleLockClick = () => {
    setFieldValue('showPassword', !values.showPassword, false);
  };

  const LockButton = (
    <Tooltip content={`${values.showPassword ? 'Hide' : 'Show'} Password`}>
      <Button
        value={values.showPassword}
        icon={values.showPassword ? 'unlock' : 'lock'}
        intent={Intent.NONE}
        onClick={handleLockClick}
      />
    </Tooltip>
  );

  return (
    <Flex align={'center'}>
      <Box w={6 / 10} pr={2} >
        <InputGroup id={fieldname} placeholder={placeholder} large
          value={values[fieldname]} onChange={handleChange}
          rightElement={lock ? LockButton : null}
          type={lock && !values.showPassword ? 'password' : 'text'}
          disabled={disabled}
        />
      </Box>
      <Box justify={'center'} hidden={!errors[fieldname]} >
        <Icon icon='warning-sign' iconSize={30} intent={Intent.DANGER} />
      </Box>
      <Box w={3 / 10} pl={2} justify={'left'} hidden={!errors[fieldname]} >
        {errors[fieldname]}
      </Box>
    </Flex>
  );
}

export default FieldWithError;
