const isEmpty = (email: string): boolean => {
  if (email.trim().length === 0) {
    return true;
  } else return false;
};

const isEmail = (email: string): boolean => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) {
    return true;
  } else return false;
};

interface ErrorsSignup {
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
}
const validateSignupData = (data: any) => {
  let errors: ErrorsSignup = {};
  if (isEmpty(data.email)) {
    errors.email = "Email must not be empty ";
  } else if (!isEmail(data.email)) {
    errors.email = "Email must be valid";
  }

  if (isEmpty(data.password)) {
    errors.password = "Password must not be empty";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  if (isEmpty(data.username)) {
    errors.username = "Username must not be empty";
  }

  return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

const validateLoginData = (data: any) => {
  let errors: ErrorsSignup = {};
  if (isEmpty(data.email)) {
    errors.email = "Email must not be empty";
  }
  if (isEmpty(data.password)) {
    errors.password = "Password must not be empty";
  }

  return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

interface UserDetails {
  bio: string;
  website: string;
  location: string;
  favoriteQuote: string;
  favoriteBooks: string;
}

const reduceUserDetails = (data: UserDetails) => {
  let userDetails: UserDetails = {
    bio: "",
    website: "",
    location: "",
    favoriteBooks: "",
    favoriteQuote: "",
  };
  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;

  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }

  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  if (!isEmpty(data.favoriteBooks.trim()))
    userDetails.favoriteBooks = data.favoriteBooks;

  if (!isEmpty(data.favoriteQuote.trim()))
    userDetails.favoriteQuote = data.favoriteQuote;

  return userDetails;
};
export { validateLoginData, validateSignupData, reduceUserDetails };
