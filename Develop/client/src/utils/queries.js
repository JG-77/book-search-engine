import { gql } from '@apollo/client';

const GET_ME = gql`
  query getUser($_id: String) {
    me(_id: $_id) {
      _id
      username
      email
      password
      savedBooks
    }
  }
`;
