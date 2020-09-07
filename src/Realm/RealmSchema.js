export const BOOK_SCHEMA = 'phoneBook';
export const PATH = 'phoneBook.realm';
export const SCHEMA_VERSION = 0;

export const PhoneBook = {
  name: BOOK_SCHEMA,
  primaryKey: 'userId',
  properties: {
    userId: 'int',
    name: 'string',
    number: 'string',
  },
};
