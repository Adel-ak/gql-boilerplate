import { gql } from 'apollo-server-core';

export default gql`
  # ***************** Types *****************
  type TestI18n {
    text: String
  }

  type TestI18nLangs {
    ar: TestI18n
  }
`;
