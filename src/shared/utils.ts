/* eslint-disable prettier/prettier */
const CHARACTERS =
  'AZERTYUIOPQSDFGHJKLMWXCVBNazertyuiopqsdfghjklmwxcvbn1234567890';

const generateCode = (length: number) => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return code;
};


export const codeGenerator = (prefix: string) =>
  `${prefix}-${Date.now().toString()}-${generateCode(5)}`;

export const generateDefaultPassword = () => generateCode(6);

export const ErrorMessages = {
  INTERNAL_SERVER_ERROR: 'An internal error has occurred. Please try again',
  ERROR_GETTING_DATA: 'Error while getting data',
  ERROR_CREATING_DATA: 'Error while creating new ',
  REQUIRED_FIELD_ERROR: 'Some required field(s) is (are) not provided.',
};

export const removeDuplicatesInArray = (values: any[], attributeFilter: any) =>
  values.reduce((acc, current) => {
    const x = acc.find(
      (item) => item[attributeFilter] === current[attributeFilter],
    );
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

export const removeDuplicatesInArrayOfString = (values: any[]) =>
  values.reduce((acc, current) => {
    const x = acc.find((value) => value === current);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

export const hasDuplicates = (array: any[]) =>
  new Set(array)?.size !== array?.length;
